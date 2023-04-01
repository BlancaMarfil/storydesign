import { useCallback, useState } from "react";

interface requestConfigTypes {
    url: string;
    method?: string;
    headers?: {};
    body?: any;
}

const useHttp = () => {
    const [error, setError] = useState({} as any);

    const sendRequest = useCallback(
        async (
            requestConfig: requestConfigTypes,
            applyData: (data: any) => void
        ) => {
            setError(null);
            try {
                const response = await fetch(requestConfig.url, {
                    method: requestConfig.method ? requestConfig.method : "GET",
                    headers: requestConfig.headers ? requestConfig.headers : {},
                    body: requestConfig.body
                        ? JSON.stringify(requestConfig.body)
                        : null, // default body is null
                });

                if (!response.ok) {
                    throw new Error("Something went wrong!");
                }
                const data: any = await response.json();
                applyData(data);
            } catch (error) {
                setError(error.message);
            }
        },
        []
    );

    return {
        error, // error: error
        sendRequest, // sendRequest: sendRequest
    };
};

export default useHttp;
