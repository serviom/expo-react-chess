import { ActivityIndicator, StatusBar, View } from 'react-native';
import React, { useEffect, useState } from 'react';
// import { StateType, useAppDispatch } from '@/features/store'; need
// import { profileAction } from '@/features/auth/authActions'; nedd
import { useSelector } from 'react-redux';
import { Background } from '@/components/Background';
import { Synchronization } from '@/components/Synchronization';

export const Wrap = ({ children }: { children: React.ReactNode }) => {
  // const dispatch = useAppDispatch(); // need
  const [loading, setLoading] = useState(false);
  // const { tokens } = useSelector((state: StateType) => state.auth); // need

  // need
  // useEffect(() => {
  //   if (tokens) {
  //     //setLoading(true);
  //     dispatch(profileAction({})).finally(() => {
  //       //setLoading(false);
  //     });
  //   }
  // }, [tokens]);

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <Synchronization>{loading ? <ActivityIndicator size="large" /> : children}</Synchronization>
    </View>
  );
};
