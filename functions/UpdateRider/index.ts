import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";
import { AzureFunction, Context } from "@azure/functions"
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import fetch from 'node-fetch';
import { ActivityStatus } from "../types";


const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    const accountName = process.env["ACCOUNT_NAME"] || "";
    const accountKey = process.env["ACCOUNT_KEY"] || "";
    const containerName = "tracking";

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let blobs = containerClient.listBlobsFlat();
    for await (const blob of blobs) {
        console.log(blob);
        const userToken = blob.name;
        const response = await fetch(`https://dashboard.hammerhead.io/v1/shares/tracking/${userToken}`, { method: 'GET' });
        if (response.ok) {
            const liveData: ActivityStatus = await response.json();
            if (liveData.state === 'riding') {
                const response = await fetch(`https://${accountName}.blob.core.windows.net/tracking/${userToken}`, { method: 'GET' });
                let trackingData: ActivityStatus = response.ok ? (await response.json()) : liveData;
                try {
                    if (!response.ok || liveData.updatedAt !== trackingData.updatedAt) {

                        const liveElapsedTime = liveData.activityInfo.filter(a => a.key == 'TYPE_ELAPSED_TIME_ID')[0].value.value;
                        const trackingElapsedTime = trackingData.activityInfo.filter(a => a.key == 'TYPE_ELAPSED_TIME_ID')[0].value.value;

                        if (liveElapsedTime < trackingElapsedTime) { // new ride, need improvment 
                            trackingData.locations = [];
                        }
                        trackingData.locations = trackingData.locations || [];
                        trackingData.locations.push(liveData.location);

                        liveData.locations = trackingData.locations;

                        const content = JSON.stringify(liveData, null, 2);
                        const blockBlobClient = containerClient.getBlockBlobClient(userToken);
                        await blockBlobClient.upload(content, content.length);
                    }
                }
                catch {                    
                    const content = JSON.stringify(liveData, null, 2);
                    const blobName = userToken;
                    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                    await blockBlobClient.upload(content, content.length);
                }
            }
        }
    }
}

export default timerTrigger;
