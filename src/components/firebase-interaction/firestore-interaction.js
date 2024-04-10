import { useState } from 'react';
import { db } from '../../config/firebase-config';
import { collection, addDoc, deleteDoc, getDoc, doc, getDocs, query, where } from 'firebase/firestore';

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
        
        console.log(locationId);
  
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
  
  



