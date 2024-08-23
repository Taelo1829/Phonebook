import { useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  View,
  TextInput,
  Text,
  SafeAreaView,
  FlatList,
  TouchableHighlight,
} from "react-native";
import * as Contacts from "expo-contacts";
import { contactsContainer, contactType } from "@/types";
import { useNavigation } from "@react-navigation/native";
export default function HomeScreen() {
  let contactContainer: contactType = [];
  const [contacts, setContacts] = useState(contactContainer);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();
  const requestPermissions = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      loadContacts();
    } else {
      console.log("Contacts permission denied");
    }
  };

  const loadContacts = async () => {
    const { data }: contactsContainer = await Contacts.getContactsAsync();
    if (data.length > 0) {
      let alphabets: string[] = [];
      let alphabetsString: string = "abcdefghijklmnopqrstuvwxyz";
      let newContacts = [
        ...data.filter((item) =>
          alphabetsString.includes(item.name[0].toLowerCase())
        ),
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
      ]
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )
        .reduce((arr, item) => {
          item.name = item.name[0].toUpperCase() + item.name.slice(1);
          if (!alphabets.includes(item.name[0])) {
            alphabets.push(item.name[0].toUpperCase());
            item.first = true;
          }
          item.style = getRandomColor().contactIcon;

          if (!arr.find((curr: any) => curr.name === item.name)) {
            arr.push(item);
          }
          return arr;
        }, []);
      setContacts(newContacts);
    }
  };

  const handleContactPress = async (name: string) => {
    let email: string = "";
    let password: string = "";
    switch (name) {
      case "Ndoda Yami":
        email = "Sbongile@gmail.com";
        password = "MiAmor";
        break;
      case "Mi Amor":
        email = "tseholoba2@gmail.com";
        password = "Tyro11";
        break;
      default:
        break;
    }

    if (email.length > 0 && password.length > 0) {
      navigation.navigate("chatScreen");
    } else {
      alert(name);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View style={styles.homepage}>
      <View style={styles.container}>
        <TextInput
          style={styles.search}
          placeholder="Search Contacts"
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      <View>
        <SafeAreaView>
          <FlatList
            data={contacts.reduce((arr, item) => {
              if (
                !arr.find((curr: any) => curr.firstName === item.firstName) &&
                item.name.includes(searchText)
              ) {
                arr.push(item);
              }
              return arr;
            }, [])}
            renderItem={(item: any) => {
              let contact = item.item;
              return (
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor="#DDDDDD"
                  onPress={() => handleContactPress(contact.name)}
                >
                  <View>
                    {contact?.first ? (
                      <View>
                        <Text style={styles.firstLetter}>
                          {contact.name[0]}
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}
                    <View style={styles.contactRow}>
                      <Text style={contact.style}>{contact.name?.at(0)}</Text>
                      <Text>{contact.name}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              );
            }}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}

function getRandomColor() {
  const colorPanel = ["#d9b99b", "#00674F", "#000", "#EADDCA"];
  let circleSize = 40;
  return StyleSheet.create({
    contactIcon: {
      margin: 10,
      backgroundColor:
        colorPanel[Math.floor(Math.random() * colorPanel.length)],
      color: "#fff",
      height: circleSize,
      width: circleSize,
      borderRadius: 50,
      textAlignVertical: "center",
      textAlign: "center",
      fontSize: 20,
    },
  });
}
const styles = StyleSheet.create({
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 15,
  },

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
});
