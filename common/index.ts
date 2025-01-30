export const handleFormSubmission = async <T>(
    callback: () => Promise<T>,
    setError: (fieldName: any, params: any) => void
) => {
    try {
        return await callback();
    } catch (err: any) {
        if (err.status === 400) {
            err.data.errors.forEach((error: any) => {
                const fieldName = error.property as keyof T;
                const errorMessage = Object.values(error.constraints || {}).join(", ");
                setError(fieldName, {
                    type: "server",
                    message: errorMessage,
                });
            });
        }
        throw err;
    }
};