import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, TextInput, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Meal = () => {
  const navigation = useNavigation();

  // State for meal sections
  const [breakfasts, setBreakfasts] = useState([]);
  const [lunches, setLunches] = useState([]);
  const [dinners, setDinners] = useState([]);
  const [snacks, setSnacks] = useState([]);

  // State for modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentMealType, setCurrentMealType] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const saveData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  const loadData = async () => {
    try {
      const breakfastData = await AsyncStorage.getItem('breakfasts');
      const lunchData = await AsyncStorage.getItem('lunches');
      const dinnerData = await AsyncStorage.getItem('dinners');
      const snackData = await AsyncStorage.getItem('snacks');

      if (breakfastData) setBreakfasts(JSON.parse(breakfastData));
      if (lunchData) setLunches(JSON.parse(lunchData));
      if (dinnerData) setDinners(JSON.parse(dinnerData));
      if (snackData) setSnacks(JSON.parse(snackData));
    } catch (error) {
      console.error('Error loading data', error);
    }
  };

  const handleAddMeal = () => {
    const mealItem = { description: newDescription, imageUrl: newImageUrl };
    let updatedMeals;

    switch (currentMealType) {
      case 'breakfast':
        updatedMeals = [...breakfasts, mealItem];
        setBreakfasts(updatedMeals);
        saveData('breakfasts', updatedMeals);
        break;
      case 'lunch':
        updatedMeals = [...lunches, mealItem];
        setLunches(updatedMeals);
        saveData('lunches', updatedMeals);
        break;
      case 'dinner':
        updatedMeals = [...dinners, mealItem];
        setDinners(updatedMeals);
        saveData('dinners', updatedMeals);
        break;
      case 'snacks':
        updatedMeals = [...snacks, mealItem];
        setSnacks(updatedMeals);
        saveData('snacks', updatedMeals);
        break;
      default:
        break;
    }
    resetModal();
  };

  const handleEditMeal = () => {
    const updatedMeal = { description: newDescription, imageUrl: newImageUrl };
    let updatedMeals;

    switch (currentMealType) {
      case 'breakfast':
        updatedMeals = breakfasts.map((item, index) => index === editingItem.index ? updatedMeal : item);
        setBreakfasts(updatedMeals);
        saveData('breakfasts', updatedMeals);
        break;
      case 'lunch':
        updatedMeals = lunches.map((item, index) => index === editingItem.index ? updatedMeal : item);
        setLunches(updatedMeals);
        saveData('lunches', updatedMeals);
        break;
      case 'dinner':
        updatedMeals = dinners.map((item, index) => index === editingItem.index ? updatedMeal : item);
        setDinners(updatedMeals);
        saveData('dinners', updatedMeals);
        break;
      case 'snacks':
        updatedMeals = snacks.map((item, index) => index === editingItem.index ? updatedMeal : item);
        setSnacks(updatedMeals);
        saveData('snacks', updatedMeals);
        break;
      default:
        break;
    }
    resetModal();
  };

  const handleDeleteMeal = (index) => {
    let updatedMeals;

    switch (currentMealType) {
      case 'breakfast':
        updatedMeals = breakfasts.filter((_, idx) => idx !== index);
        setBreakfasts(updatedMeals);
        saveData('breakfasts', updatedMeals);
        break;
      case 'lunch':
        updatedMeals = lunches.filter((_, idx) => idx !== index);
        setLunches(updatedMeals);
        saveData('lunches', updatedMeals);
        break;
      case 'dinner':
        updatedMeals = dinners.filter((_, idx) => idx !== index);
        setDinners(updatedMeals);
        saveData('dinners', updatedMeals);
        break;
      case 'snacks':
        updatedMeals = snacks.filter((_, idx) => idx !== index);
        setSnacks(updatedMeals);
        saveData('snacks', updatedMeals);
        break;
      default:
        break;
    }
  };

  const handleEditClick = (item, index) => {
    setEditingItem({ item, index });
    setNewDescription(item.description);
    setNewImageUrl(item.imageUrl);
    setModalVisible(true);
  };

  const resetModal = () => {
    setModalVisible(false);
    setNewDescription('');
    setNewImageUrl('');
    setEditingItem(null);
  };

  const renderMealItem = ({ item, index }) => (
    <View style={styles.mealItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.mealImage} />
      <View style={styles.mealDetails}>
        <Text style={styles.mealDescription}>{item.description}</Text>
        <View style={styles.itemActions}>
         
          <Pressable style={styles.deleteButton} onPress={() => handleDeleteMeal(index)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('./image/icpre.png')} style={styles.icon} />
        </Pressable>
        <Text style={styles.title}>Daily Meal Plan</Text>
      </View>

      <Image source={require('./image/baner.png')} style={styles.banner} resizeMode='cover' />

      <MealSection
        title="Breakfast"
        data={breakfasts}
        onAdd={() => { setCurrentMealType('breakfast'); setModalVisible(true); }}
        onEdit={handleEditClick}
        onDelete={handleDeleteMeal}
        renderMealItem={renderMealItem}
      />
      <MealSection
        title="Lunch"
        data={lunches}
        onAdd={() => { setCurrentMealType('lunch'); setModalVisible(true); }}
        onEdit={handleEditClick}
        onDelete={handleDeleteMeal}
        renderMealItem={renderMealItem}
      />
      <MealSection
        title="Dinner"
        data={dinners}
        onAdd={() => { setCurrentMealType('dinner'); setModalVisible(true); }}
        onEdit={handleEditClick}
        onDelete={handleDeleteMeal}
        renderMealItem={renderMealItem}
      />
      <MealSection
        title="Snacks"
        data={snacks}
        onAdd={() => { setCurrentMealType('snacks'); setModalVisible(true); }}
        onEdit={handleEditClick}
        onDelete={handleDeleteMeal}
        renderMealItem={renderMealItem}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={resetModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingItem ? 'Edit Meal' : 'Add Meal'}</Text>
            <TextInput
              value={newDescription}
              onChangeText={setNewDescription}
              style={styles.modalInput}
              placeholder='Enter meal description'
            />
            <TextInput
              value={newImageUrl}
              onChangeText={setNewImageUrl}
              style={styles.modalInput}
              placeholder='Enter image URL'
            />
            <View style={styles.buttonContainer}>
              <Pressable style={styles.modalButton} onPress={editingItem ? handleEditMeal : handleAddMeal}>
                <Text style={styles.modalButtonText}>{editingItem ? 'Update' : 'Add'}</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={resetModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const MealSection = ({ title, data, onAdd, onEdit, onDelete, renderMealItem }) => (
  <View style={styles.mealSection}>
    <View style={styles.mealHeader}>
      <Text style={styles.mealTitle}>{title}</Text>
      <Pressable style={styles.addButton} onPress={onAdd}>
        <Text style={styles.addButtonText}>Add</Text>
      </Pressable>
    </View>
    <FlatList
      data={data}
      renderItem={renderMealItem}
      keyExtractor={(item, index) => index.toString()}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginEnd: 50,
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 25,
    marginRight: 15,
    elevation: 2,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  banner: {
    width: '100%',
    height: 350,
    borderRadius: 10,
    marginBottom: 20,
  },
  mealSection: {
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 2,
    padding: 10,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    backgroundColor: '#E0E0E0',
  },
  mealDetails: {
    flex: 1,
    flexDirection:'row',display:'flex'
  },
  mealDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 5,
    elevation: 2,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 130,
    elevation: 2,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalInput: {
    width: '100%',
    padding: 12,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    marginBottom: 15,
  },
  modalButton: {
    width: 100,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default Meal;
