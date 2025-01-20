import React from "react";
import {Text} from "react-native";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorInfo: null, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        //logErrorToMyService(error, errorInfo);
        this.setState({ errorInfo });
        this.setState({ error });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <>
                    <Text>Something went wrong.</Text>
                    <Text>{JSON.stringify(this.state.errorInfo)}</Text>
                    <Text>{JSON.stringify(this.state.error)}</Text>
                </>
            )
        }

        return this.props.children;
    }
}