// UPDATED AllToysList.tsx with combined filter logic and Clear Filters button
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const sortOptions = ['Recommended', 'Newest', 'Lowest - Highest Price', 'Highest - Lowest Price'];
const ageOptions = ['0 - 5 years', '6 - 10 years', '10 - 15 years', '16 and older'];
const conditionOptions = ['1 - 4', '5 - 8', '9 - 10'];

export default function AllToysList() {
  const router = useRouter();
  const [allToys, setAllToys] = useState([]);
  const [filteredToys, setFilteredToys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [conditionModalVisible, setConditionModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Recommended');
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('products')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllToys(items);
        applyAllFilters(items);
      });
    return () => unsubscribe();
  }, [selectedSort, selectedAge, selectedCondition, searchText]);

  const applyAllFilters = (items) => {
    let result = [...items];

    if (selectedAge) {
      const ageMap = {
        '0 - 5 years': '0-5 years',
        '6 - 10 years': '6-10 years',
        '10 - 15 years': '11-15 years',
      };
      result = result.filter(toy => toy.toyType === ageMap[selectedAge]);
    }

    if (selectedCondition) {
      const [min, max] = selectedCondition.split(' - ').map(Number);
      result = result.filter(toy => {
        const cond = parseInt(toy.condition);
        return cond >= min && cond <= max;
      });
    }

    if (searchText.trim() !== '') {
      result = result.filter(toy => toy.title?.toLowerCase().includes(searchText.toLowerCase()));
    }

    if (selectedSort === 'Newest') {
      result.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    } else if (selectedSort === 'Lowest - Highest Price') {
      result.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    } else if (selectedSort === 'Highest - Lowest Price') {
      result.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    }

    setFilteredToys(result);
  };

  const clearFilters = () => {
    setSelectedSort('Recommended');
    setSelectedAge(null);
    setSelectedCondition(null);
    setSearchText('');
    setFilteredToys(allToys);
  };

  const renderFilterModal = (visible, onClose, options, onSelect, selected, title) => (
  <Modal transparent visible={visible} animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            style={[
              styles.optionPill,
              selected === opt && styles.optionPillSelected,
            ]}
          >
            <Text style={[
              styles.optionText,
              selected === opt && styles.optionTextSelected
            ]}>
              {opt}
            </Text>
            {selected === opt && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </Modal>
);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: '/screens/SellToyResultScreen', params: { data: JSON.stringify({ ...item, fromCategory: true }) } })
      }
      style={styles.card}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPrice}>Rs. {item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search by name"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            applyAllFilters(allToys);
          }}
        />
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity onPress={() => setSortModalVisible(true)} style={styles.filterBtn}>
          <Ionicons name="filter" size={16} color="#000" />
          <Text style={styles.filterLabel}>Sort by</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAgeModalVisible(true)} style={styles.filterBtn}>
          <Ionicons name="filter" size={16} color="#000" />
          <Text style={styles.filterLabel}>Age</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setConditionModalVisible(true)} style={styles.filterBtn}>
          <Ionicons name="filter" size={16} color="#000" />
          <Text style={styles.filterLabel}>Condition</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>All Toys</Text>

      <FlatList
        data={filteredToys}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No toys found.</Text>}
      />

      {renderFilterModal(sortModalVisible, () => setSortModalVisible(false), sortOptions, setSelectedSort, selectedSort, 'Sort by')}
      {renderFilterModal(ageModalVisible, () => setAgeModalVisible(false), ageOptions, setSelectedAge, selectedAge, 'Age')}
      {renderFilterModal(conditionModalVisible, () => setConditionModalVisible(false), conditionOptions, setSelectedCondition, selectedCondition, 'Condition')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingTop: 60, 
    paddingHorizontal: 12 
},
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    marginBottom: 10 
},
  backBtn: { 
    backgroundColor: '#F4B731', 
    borderRadius: 20, 
    padding: 6, 
    marginRight: 10 
},
  searchWrapper: { 
    paddingHorizontal: 12, 
    marginBottom: 10 
},
  searchInput: { 
    backgroundColor: '#F4F4F4', 
    borderRadius: 10, 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    fontSize: 14, 
    borderWidth: 1, 
    borderColor: '#ddd' 
},
  filterBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
},
  filterBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f2f2f2', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
},
  filterLabel: { 
    marginLeft: 6, 
    fontSize: 13 
},
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    fontFamily: 'BalooTammudu2-SemiBold', 
    marginBottom: 12 
},
  grid: { 
    paddingBottom: 140 
},
  card: { 
    width: 161, 
    height: 290, 
    backgroundColor: '#F5F5F5', 
    margin: '1.5%', 
    borderRadius: 12, 
    overflow: 'hidden', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 3, 
    marginHorizontal: 9 
},
  cardImage: { 
    width: '100%', 
    height: 220 
},
  cardTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginHorizontal: 10, 
    marginTop: 8, 
    fontFamily: 'ABeeZee-Regular' 
},
  cardPrice: { 
    fontSize: 13, 
    color: '#555', 
    marginHorizontal: 10, 
    marginBottom: 10, 
    fontFamily: 'ABeeZee-Regular' 
},
  emptyText: { 
    textAlign: 'center', 
    marginTop: 100, 
    fontSize: 16, 
    color: '#888' 
},
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0,0,0,0.2)' 
},
  modalContent: { 
    backgroundColor: 'white', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    padding: 16 
},
  modalTitle: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginBottom: 12 
},
  modalOption: { 
    paddingVertical: 10 
},
  modalOptionText: { 
    color: '#000' 
},
  selectedOption: { 
    color: '#F4B731', 
    fontWeight: 'bold' 
},
  modalCancelBtn: { 
    marginTop: 10 
},
  modalCancelText: { 
    textAlign: 'center', 
    color: 'red' 
},
 modalClearBtn: { 
    marginBottom: 10 
},
  modalClearText: { 
    textAlign: 'center', 
    color: 'blue', 
    fontWeight: 'bold' 
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
},
clearText: {
  color: '#888',
  fontSize: 16,
},
closeIcon: {
  fontSize: 18,
  color: '#333',
},
optionPill: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#F5F5F5',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 20,
  marginBottom: 10,
  width: 342,
  height: 56
},
optionPillSelected: {
  backgroundColor: '#F4B731',
},
optionText: {
  fontSize: 16,
  color: '#333',
},
optionTextSelected: {
  color: '#fff',
  fontWeight: 'bold',
},
checkMark: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
});
