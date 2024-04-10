import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { Star } from '@mui/icons-material';
import { getLocationDataById } from '../firebase-interaction/firestore-interaction';
import { db } from '../../config/firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const UserFavorites = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesRef = collection(db, 'favorites');
        const userFavoritesQuery = query(favoritesRef, where('userId', '==', userId));
        const favoritesSnapshot = await getDocs(userFavoritesQuery);
        const favoriteLocationIds = favoritesSnapshot.docs.map(doc => doc.data().locationId);
        const favoriteLocationsData = await getLocationDataById(favoriteLocationIds);
        setFavorites(favoriteLocationsData);
      } catch (error) {
        console.error('Error fetching user favorites:', error);
      }
    };

    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  return (
    <div>
      {userId ? (
        favorites.length > 0 ? (
          favorites.map(favorite => (
            <div key={favorite.id}>
              <IconButton edge="end">
                <Star sx={{ color: 'yellow' }} />
              </IconButton>
              <span>{favorite.city}, {favorite.country_code}</span>
            </div>
          ))
        ) : (
          <p>No favorites found</p>
        )
      ) : (
        <p>Log in to save favorites</p>
      )}
    </div>
  );
};

export default UserFavorites;
