import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function Help() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: 'How do I donate a toy?',
      answer:
        'Tap the upload icon at the bottom, select "Donate Toy", fill out the toy details and submit. Your listing will appear under "Newly Uploaded".',
    },
    {
      question: 'How does the repair service work?',
      answer:
        'Select "Request Repair" from the upload options. Enter your toy details and issue. You’ll be contacted by a repair partner if matched.',
    },
    {
      question: 'Can I delete or edit my profile?',
      answer:
        'Yes. Go to your Profile → Edit Profile. For account deletion, contact support at support@toysavior.app.',
    },
    {
      question: 'Is Toy Savior free to use?',
      answer:
        'Yes! All donation and repair requests are completely free of charge. Selling may include transaction options in future versions.',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.heading}>Help & Support</Text>

      {/* Intro */}
      <Text style={styles.paragraph}>
        Toy Savior helps you donate, repair, or resell toys in just a few steps. Here's a quick guide to common actions and support options.
      </Text>

      {/* FAQ Section */}
      {faqItems.map((item, index) => (
        <View key={index} style={styles.card}>
          <TouchableOpacity style={styles.questionRow} onPress={() => toggle(index)}>
            <Text style={styles.question}>{item.question}</Text>
            <Ionicons
              name={openIndex === index ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
          {openIndex === index && <Text style={styles.answer}>{item.answer}</Text>}
        </View>
      ))}

      {/* Contact Support */}
      <Text style={styles.contactTitle}>Need More Help?</Text>
      <Text style={styles.paragraph}>
        If you have technical issues, feature requests, or wish to delete your account, email us at:
      </Text>
      <TouchableOpacity
        onPress={() => Linking.openURL('mailto:support@toysavior.app')}
        style={styles.emailButton}
      >
        <Text style={styles.emailText}>support@toysavior.app</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 20,
    backgroundColor: '#F4B731',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'ABeeZee-Regular',
    color: '#333',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
    color: '#000',
    flex: 1,
  },
  answer: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'ABeeZee-Regular',
    color: '#444',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
    marginTop: 28,
    marginBottom: 8,
  },
  emailButton: {
    backgroundColor: '#F4B731',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  emailText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'ABeeZee-Regular',
  },
});
