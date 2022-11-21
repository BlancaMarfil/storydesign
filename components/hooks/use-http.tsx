import { useState } from "react";

interface requestConfigTypes {
    url: string;
    method?: string;
    headers?: {};
    body?: string;
}

const useHttp = (
    requestConfig: requestConfigTypes,
    applyData: (data: any) => void
) => {
    // const [error, setError] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);

    const sendRequest = async () => {
        // setIsLoading(true);
        // setError(null);
        try {
            const response = await fetch(requestConfig.url, {
                method: requestConfig.method ? requestConfig.method : "GET", // if no method is defined -> default is GET
                headers: requestConfig.headers ? requestConfig.headers : {}, // default headers is an empty object
                body: requestConfig.body
                    ? JSON.stringify(requestConfig.body)
                    : null, // default body is null
            });
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }
            const data = await response.json();

            applyData(data);
        } catch (error) {
            // setError(error.message);
        }
        // setIsLoading(false);
    };

    return {
        // You can return whatever you want
        // isLoading, // This is the same as: isLoading: isLoading
        // error, // error: error
        sendRequest, // sendRequest: sendRequest
    };
};

export default useHttp;
