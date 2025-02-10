export const Stockfish = (function() {
    let instance: object;

    function createInstance() {
        // @ts-ignore
        const object = engineStockfish;
        return object;
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


const isError = function(event: string) {
    return event.startsWith("Error") || event.startsWith("Undefined") || event.startsWith("No such option") || event.startsWith("Unknown command");
}

export const stockfishCommand = function (command: string): void {
    const engine = Stockfish.getInstance();
    // @ts-ignore
    engine.postMessage(command);
}

export const stockfishPromise = async function (command: string, callback: Function | null = null ): Promise<any> {

    const engine = Stockfish.getInstance();

    try {
        const promise = await new Promise((resolve, reject) => {
            // @ts-ignore
            engine.onmessage = function(event: string | object) {
                let line;

                if (event && typeof event === "object") {
                    // @ts-ignore
                    line = event.data;
                } else {
                    line = event;
                }

                //console.log('command: ' + command + ', line: ' + line, new Date().getTime());
                if (isError(line)) {
                    reject(line);
                }
                if (callback !== null && callback(line)) {
                    resolve(line);
                }
            };
            // @ts-ignore
            engine.postMessage(command);
        });

        return promise;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export type BestMove = {from: string, to: string, promotion: string};


export const getBestmoveByStockfish = (fen: string) => {
    const skillLevelType = 20; // 0 min 20 max 20
    const skillLevelProbability = 500; //128 min 1 max 1000
    const depth = 20;

    return new Promise((resolve, reject) => {
        stockfishPromise(`uci`, (value: string) => {
            return value.startsWith('uciok');
        }).then((response: string) => {
            stockfishCommand(`setoption name Skill Level value ${skillLevelType};`);
            stockfishCommand(`setoption name Skill Level Probability value ${skillLevelProbability}`);
            return stockfishPromise(`isready`, (value: string) => {
                return value.startsWith('readyok');
            });
        }).then((response: string) => {
            stockfishCommand(`position fen ${fen}`);
            return stockfishPromise(`go depth ${depth}`, (value: string) => {
                return value.startsWith('bestmove');
            });
        }).then((response: string) => {
            const matches = response.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            if (matches !== null && matches.length > 1) {
                resolve({
                    from: matches[1],
                    to: matches[2],
                    promotion: matches[3]
                });
            }
        }).catch((error) => {
            console.log(error);
            reject(error);
        });
    });

}
