import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export const createOrGetChat = async (otherUserId, otherUserData) => {
  const currentUser = auth().currentUser;
  if (!currentUser) throw new Error("User not authenticated");

  // Check if chat already exists
  const existingChatQuery = await firestore()
    .collection("chats")
    .where("participants", "array-contains-any", [currentUser.uid, otherUserId])
    .get();

  let existingChat = null;
  existingChatQuery.docs.forEach((doc) => {
    const data = doc.data();
    if (
      data.participants.includes(currentUser.uid) &&
      data.participants.includes(otherUserId)
    ) {
      existingChat = { id: doc.id, ...data };
    }
  });

  if (existingChat) {
    return existingChat.id;
  }

  // Create new chat
  const currentUserData = {
    firstName: currentUser.displayName?.split(" ")[0] || "User",
    lastName: currentUser.displayName?.split(" ")[1] || "",
    role: "user", // You might want to fetch this from user document
    email: currentUser.email,
  };

  const chatRef = await firestore()
    .collection("chats")
    .add({
      participants: [currentUser.uid, otherUserId],
      participantDetails: {
        [currentUser.uid]: currentUserData,
        [otherUserId]: otherUserData,
      },
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

  return chatRef.id;
};

// Dummy chat data generator
export const createDummyChat = async () => {
  try {
    // Sample user data from your examples
    const khalidData = {
      uid: "aLsaZaqYz8gxFtwXOTBqWVIRtQC3",
      email: "Ka@gmail.com",
      firstName: "Khalid",
      lastName: "Azhar",
      role: "user",
    };

    const sarimData = {
      uid: "GtT8yzyi6uNWaTYKRxBZAKURew13",
      businessHours: "11 Am - 6 Am",
      cnic: "4220112345670",
      email: "sarim.tech@gmail.com",
      experience: "1 year",
      firstName: "Sarim",
      lastName: "Hassan",
      photoURL:
        "https://res.cloudinary.com/dqke8pf3p/image/upload/v1750193116/z5tvkzzm7deiyvcugq6s.jpg",
      role: "repairer",
      skills: "Hardware repairer",
    };

    // Create chat document
    const chatRef = await firestore()
      .collection("chats")
      .add({
        participants: [khalidData.uid, sarimData.uid],
        participantDetails: {
          [khalidData.uid]: khalidData,
          [sarimData.uid]: sarimData,
        },
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

    // Dummy messages conversation
    const dummyMessages = [
      {
        text: "Hi, I need help with my iPhone. The screen is cracked and it's not responding properly.",
        senderId: khalidData.uid,
        senderName: "Khalid Azhar",
        delay: 0,
      },
      {
        text: "Hello Khalid! I can definitely help you with that. Can you tell me which iPhone model you have?",
        senderId: sarimData.uid,
        senderName: "Sarim Hassan",
        delay: 2000,
      },
      {
        text: "It's an iPhone 12 Pro. I dropped it yesterday and now the touch isn't working in some areas.",
        senderId: khalidData.uid,
        senderName: "Khalid Azhar",
        delay: 4000,
      },
      {
        text: "I see. For iPhone 12 Pro screen replacement, it typically costs around PKR 25,000-30,000 depending on whether we use original or aftermarket parts. The repair usually takes 2-3 hours.",
        senderId: sarimData.uid,
        senderName: "Sarim Hassan",
        delay: 6000,
      },
      {
        text: "That sounds reasonable. How long have you been doing iPhone repairs?",
        senderId: khalidData.uid,
        senderName: "Khalid Azhar",
        delay: 8000,
      },
      {
        text: "I have 1 year of experience specializing in hardware repairs. I work from 11 AM to 6 PM and have successfully repaired over 200 devices. Would you like to bring your phone to my shop?",
        senderId: sarimData.uid,
        senderName: "Sarim Hassan",
        delay: 10000,
      },
      {
        text: "Yes, that would be great! What's your location?",
        senderId: khalidData.uid,
        senderName: "Khalid Azhar",
        delay: 12000,
      },
      {
        text: "I'm located in Gulshan-e-Iqbal. I can share the exact address once you confirm. Also, I provide 3 months warranty on screen replacements.",
        senderId: sarimData.uid,
        senderName: "Sarim Hassan",
        delay: 14000,
      },
      {
        text: "Perfect! Please share the address. I can come tomorrow around 2 PM.",
        senderId: khalidData.uid,
        senderName: "Khalid Azhar",
        delay: 16000,
      },
      {
        text: "Great! I'll be available at that time. My shop address is: Shop #45, Block 13-D, Gulshan-e-Iqbal, Karachi. See you tomorrow!",
        senderId: sarimData.uid,
        senderName: "Sarim Hassan",
        delay: 18000,
      },
    ];

    // Add messages with delays to simulate real conversation
    let lastMessageText = "";
    for (let i = 0; i < dummyMessages.length; i++) {
      const message = dummyMessages[i];

      setTimeout(async () => {
        try {
          // Add message to subcollection
          await firestore()
            .collection("chats")
            .doc(chatRef.id)
            .collection("messages")
            .add({
              text: message.text,
              senderId: message.senderId,
              senderName: message.senderName,
              timestamp: firestore.FieldValue.serverTimestamp(),
              type: "text",
              readBy: [message.senderId],
            });

          // Update last message in chat document
          await firestore()
            .collection("chats")
            .doc(chatRef.id)
            .update({
              lastMessage: {
                text: message.text,
                senderId: message.senderId,
                timestamp: firestore.FieldValue.serverTimestamp(),
                type: "text",
              },
              updatedAt: firestore.FieldValue.serverTimestamp(),
            });
        } catch (error) {
          console.error("Error adding dummy message:", error);
        }
      }, message.delay);

      lastMessageText = message.text;
    }

    console.log("Dummy chat created successfully with ID:", chatRef.id);
    return chatRef.id;
  } catch (error) {
    console.error("Error creating dummy chat:", error);
    throw error;
  }
};
