import { Auth } from './components/authentication';
import { auth } from './config/firebase';
import './App.css';
import { db } from './config/firebase';
import { useEffect, useState } from 'react';
import { getDocs, doc, collection, addDoc, deleteDoc, updateDoc} from 'firebase/firestore';

function App() {

  const [locationList, setLocationList] = useState([]);
  const locationsCollection = collection(db, "locations");

  // new location state
  const [newLocationCity, setNewLocationCity] = useState('');
  const [newLocationTemperature, setNewLocationTemperature] = useState(0);

  // update temperature state
  const [updatedTemp, setUpdatedTemp] = useState(0);

  const getLocationList = async () => {
    // read the data from the database
    // set the location list
    try {
      const data = await getDocs(locationsCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(), id: doc.id}))
      setLocationList(filteredData);
    } catch (err) {
      console.error(err);
    }
};

  useEffect(() => {
    getLocationList();
  }, [])

  const onSubmitLocation = async () => {
    try {
      await addDoc(locationsCollection, {
      city: newLocationCity, 
      temperature: newLocationTemperature,
      userId: auth?.currentUser?.uid
      });

      getLocationList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLocation = async (id) => {
    const locationDoc = doc(db, "locations", id)
    await deleteDoc(locationDoc);
  };

  const updateLocationTemperature = async (id) => {
    const locationDoc = doc(db, "locations", id)
    await updateDoc(locationDoc, { temperature: updatedTemp});
  };

  return (
    <div className="App">
      <Auth />

    <div>
      <input
         placeholder='City...' 
         onChange={(e) => setNewLocationCity(e.target.value)}
      />
      <input 
        placeholder='Temperature...' 
        type='number' 
        onChange={(e) => setNewLocationTemperature(Number(e.target.value))}
      />
      <button onClick={onSubmitLocation}> Submit location </button>
    </div>

      <div>
        {locationList.map((location) => (
          <div>
            <h1> {location.city} </h1>
            <p> {location.temperature} </p>

            <button onClick={() => deleteLocation(location.id)}> Delete Location </button>
            
            <input 
              placeholder='New Temperature' 
              onChange={(e) => setUpdatedTemp(e.target.value)} />
            <button onClick={() => updateLocationTemperature(location.id)}> Update Temperature </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
