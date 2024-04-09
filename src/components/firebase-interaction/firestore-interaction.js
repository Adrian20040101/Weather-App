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
        
        const userFavoritesRef = collection(db, 'users', userId, 'favorites');
        await addDoc(userFavoritesRef, { locationId });
        
        console.log('Location added to favorites successfully.');
        return locationId;  // return the id to be able to process it in the remove method when calling it
    } catch (error) {
        console.error('Error adding location to favorites:', error);
    }
};


export const removeFromFavorites = async (userId, locationId) => {
    try {
        const favoriteRef = doc(db, 'users', userId, 'favorites', locationId);
        const favoriteSnapshot = await getDoc(favoriteRef);

        console.log(locationId);
        if (favoriteSnapshot.exists()) {
            await deleteDoc(favoriteRef);
            console.log('Location removed from favorites successfully');
        } else {
            console.log('Location not found in favorites');
        }
    } catch (error) {
        console.error('Error removing location from favorites:', error);
    }
};


