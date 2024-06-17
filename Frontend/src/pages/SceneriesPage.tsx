import { useEffect, useState } from "react";
import agent from "../api/agent";
import { renderImageDataToString } from "../tools/RenderImageData";

interface Scenery {
    sceneryId: string;
    sceneryName: string;
    country: string;
    city: string;
    comment: string;
    imageData: Uint8Array;
}

export default function SceneriesPage() {
    const [sceneries, setSceneries] = useState<Scenery[]>([]);

    useEffect(() => {
        fetchSceneries();
    }, []);

    const fetchSceneries = async () => {
        try {
            const sceneriesData = await agent.getAllSceneries();
            setSceneries(sceneriesData);
        } catch (error) {
            console.error('Error fetching sceneries:', error);
        }
    };

    return (
        <div>
            <h1>Sceneries</h1>
            <ul>
                {sceneries.map(scenery => (
                    <li key={scenery.sceneryId}>
                        <div>
                            <strong>Name:</strong> {scenery.sceneryName}
                        </div>
                        <div>
                            <strong>Country:</strong> {scenery.country}
                        </div>
                        <div>
                            <strong>City:</strong> {scenery.city}
                        </div>
                        <div>
                            <strong>Comment:</strong> {scenery.comment}
                        </div>
                        <div>
                            <strong>ImageData:</strong> {renderImageDataToString(scenery.imageData)}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
