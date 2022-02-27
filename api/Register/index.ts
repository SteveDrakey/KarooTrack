import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import fetch from 'node-fetch';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    const userToken = req.query.token;

    const response = await fetch(`https://dashboard.hammerhead.io/v1/shares/tracking/${userToken}`, { method: 'GET' });

    if (!response.ok) {
        context.res = {
            status: 500, 
            body: `usernotfound ${userToken}`
        };
    } else {
        const accountName = process.env["ACCOUNT_NAME"] || "";
        const accountKey = process.env["ACCOUNT_KEY"] || "";
        const containerName = "tracking";
        const liveData = await response.json();
        liveData.locations = [];

        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential
        );
        const content = JSON.stringify(liveData, null, 2);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(userToken);
        await blockBlobClient.upload(content, content.length);

        context.res = {
            status: 200, 
            body: liveData
        };
    }
};

export default httpTrigger;