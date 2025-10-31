import { RiseLoader } from "react-spinners";

export function Spinner() {
    return (
        <RiseLoader 
            color="#eab308" 
            size={10}
            margin={3}
            speedMultiplier={0.8}
        />
    )
}