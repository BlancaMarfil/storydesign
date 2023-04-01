import { useRouter } from "next/router";
import { useEffect } from "react";

const index = () => {
    // Router
    const router = useRouter();

    useEffect(() => {
        router.push("/categories/All");
    }, []);
};

export default index;
