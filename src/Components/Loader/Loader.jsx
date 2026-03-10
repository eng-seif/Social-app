import { Spinner } from "@heroui/react";

export default function Loader() {
    return (
        <div className="h-screen flex justify-center items-center">

            <Spinner classNames={{ label: "text-foreground mt-4" }} variant="dots" />

        </div>

    )
}