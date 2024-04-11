import { useState } from 'react';
import { db } from '../../config/firebase-config';
import { collection, addDoc, deleteDoc, getDoc, doc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';


// favorites interaction


export const addToFavorites = async (userId, locationData) => {
    try {
        const locationsRef = collection(db, 'locations');
        const locationQuery = query(locationsRef, 
            where('city', '==', locationData.city),
            where('country_code', '==', locationData.country_code)
        );

        const querySnapshot = await getDocs(locationQuery);

        let locationId;

        if (querySnapshot.empty) {
            const newLocationRef = await addDoc(locationsRef, locationData);
            locationId = newLocationRef.id;
        } else {
            const existingLocation = querySnapshot.docs[0];
            locationId = existingLocation.id;
        }

        const userFavoritesRef = collection(db, 'favorites');

        await addDoc(userFavoritesRef, {
            userId: userId,
            locationId: locationId
        });

        console.log('Location added to favorites successfully.');
        return locationId;
    } catch (error) {
        console.error('Error adding location to favorites:', error);
        throw error;
    }
};



export const getFavoritesByUserId = async (userId) => {
    try {
        const favoritesRef = collection(db, 'favorites');
        const userFavoritesQuery = query(favoritesRef, where('userId', '==', userId));
        const favoritesSnapshot = await getDocs(userFavoritesQuery);

        const favoriteLocationIds = [];
        favoritesSnapshot.forEach(doc => {
            favoriteLocationIds.push(doc.data().locationId);
        });

        return favoriteLocationIds;
    } catch (error) {
        console.error('Error getting favorites by user ID:', error);
        throw error;
    }
};


export const getLocationDataById = async (locationIds) => {
    try {
        const locationDataArray = [];

        for (const locationId of locationIds) {
            const locationDocRef = doc(db, 'locations', locationId)
            const locationSnapshot = await getDoc(locationDocRef);
            if (locationSnapshot.exists()) {
                const locationData = locationSnapshot.data();
                locationDataArray.push(locationData);
            }
        }

        return locationDataArray;
    } catch (error) {
        console.error('Error fetching location data:', error);
        throw error;
    }
};


export const removeFromFavorites = async (userId, locationData) => {
    try {
      const locationsRef = collection(db, 'locations');
      const locationQuerySnapshot = await getDocs(query(locationsRef, 
        where('city', '==', locationData.city),
        where('country_code', '==', locationData.country_code)
      ));
  
      if (!locationQuerySnapshot.empty) {
        const locationId = locationQuerySnapshot.docs[0].id;
        const favoritesRef = collection(db, 'favorites');
        const favoritesQuerySnapshot = await getDocs(query(favoritesRef, 
          where('userId', '==', userId), 
          where('locationId', '==', locationId)
        ));
  
        if (!favoritesQuerySnapshot.empty) {
          const favoriteDoc = favoritesQuerySnapshot.docs[0];
          await deleteDoc(favoriteDoc.ref);
          console.log('Location removed from favorites successfully');
        } else {
          console.log('Location not found in favorites');
        }
      } else {
        console.log('Location not found in the locations collection');
      }
    } catch (error) {
      console.error('Error removing location from favorites:', error);
      throw error;
    }
  };
  
  

// recents interaction


export const addRecentSearch = async (userId, locationData) => {
    try {
        const city = locationData.label.split(',')[0];
        const country_code = locationData.label.split(',')[1];
        const latitude = locationData.value.split(' ')[0];
        const longitude = locationData.value.split(' ')[1];
        const location = {
            city: city,
            country_code: country_code,
            latitude: latitude,
            longitude: longitude
        };

        console.log(location);
        const locationsRef = collection(db, 'locations');
        const locationQuery = query(locationsRef, 
            where('city', '==', city),
            where('country_code', '==', country_code)
        );

        const querySnapshot = await getDocs(locationQuery);

        let locationId;

        if (querySnapshot.empty) {
            const newLocationRef = await addDoc(locationsRef, location);
            locationId = newLocationRef.id;
        } else {
            const existingLocation = querySnapshot.docs[0];
            locationId = existingLocation.id;
        }

        const userRecentsRef = collection(db, 'recents');

        await addDoc(userRecentsRef, {
            userId: userId,
            locationId: locationId,
            timestamp: new Date()
        });

        console.log('Location added to recents successfully.');
        return locationId;
    } catch (error) {
        console.error('Error adding location to recents:', error);
        throw error;
    }
  };
  


  export const getRecentsByUserId = async (userId) => {
    try {
        const recentsRef = collection(db, 'recents');
        const userRecentsQuery = query(recentsRef, where('userId', '==', userId), orderBy('timestamp', 'desc'), limit(3));
        const recentsSnapshot = await getDocs(userRecentsQuery);
  
        const recentSearchIds = [];
        recentsSnapshot.forEach(doc => {
            recentSearchIds.push(doc.data().locationId);
        });
  
        return recentSearchIds;
    } catch (error) {
        console.error('Error getting recents by user ID:', error);
        throw error;
    }
  };

