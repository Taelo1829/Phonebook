import { useEffect, useState } from "react";
import { StyleSheet, Platform, View, TextInput, Text } from "react-native";
import * as Contacts from "expo-contacts";
import * as Permissions from "expo-permissions";
import { contactsContainer, contactType } from "@/types";
export default function HomeScreen() {
  let contactContainer: contactType = [];
  const [contacts, setContacts] = useState(contactContainer);

  const requestPermissions = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      loadContacts();
    } else {
      console.log("Contacts permission denied");
    }
  };

  // Function to load contacts
  const loadContacts = async () => {
    const { data }: contactsContainer = await Contacts.getContactsAsync();
    if (data.length > 0) {
      let additionalContacts: contactType = [
        {
          contactType: "person",
          firstName: "Mi",
          id: "885",
          imageAvailable: false,
          lastName: "Amor",
          lookupKey:
            "1885r714-4E2C4644363A40324C2A30322C32.3789r715-4E2C4644363A40324C2A30322C32",
          name: "Mi Amor",
          phoneNumbers: [
            {
              id: "2305",
              isPrimary: 0,
              label: "mobile",
              number: "+27658808334",
              type: "2",
            },
          ],
        },
        {
          contactType: "person",
          firstName: "Ndoda",
          id: "886",
          imageAvailable: false,
          lastName: "Yami",
          lookupKey:
            "1885r714-4E2C4644363A40324C2A30322C32.3789r715-4E2C4644363A40324C2A30322C32",
          name: "Ndoda Yami",
          phoneNumbers: [
            {
              id: "2305",
              isPrimary: 0,
              label: "mobile",
              number: "+27742019041",
              type: "2",
            },
          ],
        },
      ];
      let alphabets: string[] = [];
      let alphabetsString: string = "abcdefghijklmnopqrstuvwxyz";
      setContacts(
        [
          ...data.filter((item) =>
            alphabetsString.includes(item.name[0].toLowerCase())
          ),
          ...additionalContacts,
        ]
          .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          )
          .map((item) => {
            if (!alphabets.includes(item.name[0])) {
              alphabets.push(item.name[0]);
              item.first = true;
            }
            return item;
          })
      );
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View style={styles.homepage}>
      <View style={styles.container}>
        <TextInput style={styles.search} placeholder="Search Contacts" />
      </View>
      <View>
        {contacts.map((contact, index) => (
          <View key={index} style={styles.contactRow}>
            <Text style={styles.firstLetter}>
              {contact.first ? contact.name[0] : ""}
            </Text>
            <Text style={styles.contactIcon}>{contact.name[0]}</Text>
            <Text>{contact.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  firstLetter: {
    fontSize: 30,
    color: "#00674F",
  },
  homepage: {
    height: "100%",
    paddingTop: Platform.OS === "android" ? 80 : 0,
  },
  heading: {
    fontSize: 30,
  },
  search: {
    backgroundColor: "#faf0e6",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    borderWidth: 1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  contactIcon: {
    margin: 10,
  },
});
