import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize SES client
const sesClient = new SESClient({ region: "ap-south-1" });

export const handler = async(event) => {
  try {
    console.log("Lambda function invoked with event:", event);

    // Loop over all sqs events
    for(const record of event.Records){

      const snsEnvelope = JSON.parse(record.body);
      const body = JSON.parse(snsEnvelope.Message);

      console.log("Body:" ,body);

      const {toEmail, subject, message} = body;

      if (!toEmail || !subject || !message) {
        console.error("❌ Missing required fields, skipping:", body);
        throw new Error("Missing required fields");
      }

      const params = {
        Source: "dakshsawhney2@gmail.com",
        Destination: {
          ToAddresses: [toEmail]
        },
        Message: {
          Subject: {
            Data: subject
          },
          Body: {
            Text: { Data: message}
          }
        }
      }

      const command = new SendEmailCommand(params);
      await sesClient.send(command)

      console.log("Email sent successfully to:", toEmail);
    }

  } catch (error) {
    console.log(error)
    throw error
  }
}
