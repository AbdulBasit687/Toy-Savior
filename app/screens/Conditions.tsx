import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Conditions() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Toy Savior – Terms & Conditions</Text>

      <Text style={styles.sectionTitle}>Welcome to Toy Savior</Text>
      <Text style={styles.paragraph}>
        We welcome you to <Text style={styles.bold}>Toy Savior</Text>, a community-powered platform dedicated to extending the life of toys through donation, resale, and repair services. By accessing and using this application, you agree to the terms outlined herein. These Terms & Conditions govern your use of our services and serve to protect both you and the platform.
      </Text>
      <Text style={styles.paragraph}>
        Please read them carefully. Continued use of the Toy Savior app constitutes your acceptance of these terms.
      </Text>

      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.paragraph}>
        By accessing the Toy Savior mobile or web application (hereafter “the App”), you acknowledge that you have read, understood, and agree to be legally bound by these Terms & Conditions, including any future modifications. If you do not agree with any part of these terms, you must discontinue use of the App immediately.
      </Text>

      <Text style={styles.sectionTitle}>2. Eligibility</Text>
      <Text style={styles.paragraph}>
        Use of the App is limited to individuals who are:
      </Text>
      <Text style={styles.bullet}>• At least 13 years of age (or the minimum age required by your local laws)</Text>
      <Text style={styles.bullet}>• Capable of entering into legally binding agreements</Text>

      <Text style={styles.sectionTitle}>3. User Obligations</Text>
      <Text style={styles.bullet}>• Provide accurate, complete, and up-to-date registration information</Text>
      <Text style={styles.bullet}>• Maintain the security of your account credentials</Text>
      <Text style={styles.bullet}>• Be responsible for all activities conducted under your account</Text>
      <Text style={styles.paragraph}>You further agree not to:</Text>
      <Text style={styles.bullet}>• Submit false or misleading information</Text>
      <Text style={styles.bullet}>• Upload or donate items that are prohibited, dangerous, or offensive</Text>
      <Text style={styles.bullet}>• Impersonate any person or entity or falsely claim affiliation</Text>

      <Text style={styles.sectionTitle}>4. Donations, Repairs, and Resale</Text>
      <Text style={styles.bullet}>• The App functions as an intermediary and is not responsible for handling or delivery</Text>
      <Text style={styles.bullet}>• Items are offered and received "as-is" without warranties</Text>
      <Text style={styles.bullet}>• Any disputes must be resolved between involved parties</Text>

      <Text style={styles.sectionTitle}>5. Prohibited Content</Text>
      <Text style={styles.bullet}>• Unsafe, broken beyond repair, or contaminated items</Text>
      <Text style={styles.bullet}>• Toys promoting violence, hatred, or adult content</Text>
      <Text style={styles.bullet}>• Copyrighted material without authorization</Text>
      <Text style={styles.paragraph}>
        Violation may result in immediate suspension or legal action.
      </Text>

      <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
      <Text style={styles.bullet}>• Use or inability to use the App</Text>
      <Text style={styles.bullet}>• Errors, omissions, or inaccurate data</Text>
      <Text style={styles.bullet}>• Third-party transactions or interactions</Text>

      <Text style={styles.sectionTitle}>7. Data Collection & Privacy</Text>
      <Text style={styles.bullet}>• We collect data like email, location (if permitted), and images</Text>
      <Text style={styles.bullet}>• Used to improve functionality and match services</Text>
      <Text style={styles.bullet}>• Managed under our Privacy Policy; not sold or shared without consent</Text>

      <Text style={styles.sectionTitle}>8. Intellectual Property</Text>
      <Text style={styles.paragraph}>
        All content, designs, and branding remain the property of Toy Savior developers or affiliated institutions. Users may not copy, modify, or distribute without permission.
      </Text>

      <Text style={styles.sectionTitle}>9. Account Suspension and Termination</Text>
      <Text style={styles.bullet}>• Repeated violations of the terms</Text>
      <Text style={styles.bullet}>• Fraudulent, malicious, or illegal activity</Text>
      <Text style={styles.bullet}>• Abuse or misuse as determined by admins</Text>

      <Text style={styles.sectionTitle}>10. Amendments</Text>
      <Text style={styles.paragraph}>
        We may update these terms at any time. Continued use after changes implies your acceptance.
      </Text>

      <Text style={styles.sectionTitle}>11. Governing Law</Text>
      <Text style={styles.paragraph}>
        These terms are governed by your local jurisdiction. Please consult legal counsel if unsure.
      </Text>

      <Text style={styles.sectionTitle}>12. Contact</Text>
      <Text style={styles.paragraph}>
        Toy Savior Admin Team{'\n'}
        📧 Email: <Text style={styles.bottomBold}>support@toysavior.app</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 20,
  },
   backButton: {
    backgroundColor: "#F4B731",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
   },
  content: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 6,
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    fontFamily: 'ABeeZee-Regular',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    paddingLeft: 10,
    marginBottom: 4,
    fontFamily: 'ABeeZee-Regular',
  },
  bold: {
    fontWeight: 'bold',
  },
  bottomBold:{
    fontWeight: 'bold',
    paddingBottom: 70,
  },
});
