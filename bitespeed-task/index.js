const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient({});

app.use(bodyParser.json());

app.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;

  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    },
    orderBy: { createdAt: "asc" }
  });

  if (contacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary"
      }
    });

    return res.json({
      contact: {
        primaryContactId: newContact.id,
        emails: [email],
        phoneNumbers: [phoneNumber],
        secondaryContactIds: []
      }
    });
  }

  let primary = contacts.find(c => c.linkPrecedence === "primary") || contacts[0];

  if (!contacts.some(c => c.email === email && c.phoneNumber === phoneNumber)) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primary.id,
        linkPrecedence: "secondary"
      }
    });
  }

  const allContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primary.id },
        { linkedId: primary.id }
      ]
    }
  });

  const emails = [...new Set(allContacts.map(c => c.email).filter(Boolean))];
  const phones = [...new Set(allContacts.map(c => c.phoneNumber).filter(Boolean))];
  const secondaryIds = allContacts
    .filter(c => c.linkPrecedence === "secondary")
    .map(c => c.id);

  res.json({
    contact: {
      primaryContactId: primary.id,
      emails,
      phoneNumbers: phones,
      secondaryContactIds: secondaryIds
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});