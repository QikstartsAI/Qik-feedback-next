type FeedbackType = {
  phoneNumbers:string[] | [],
  message:string,
  sessionId:string
}

export const sendFeedbackMessage = async ({
  phoneNumbers,
  message,
  sessionId
}: FeedbackType) => {
  console.log(sessionId, phoneNumbers)
  await fetch(`http://localhost:3000/api/send-message/${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      numbers: phoneNumbers,
      message,
    }),
  });
  console.log("Feedback message sent!")
}