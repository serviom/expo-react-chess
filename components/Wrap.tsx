import React from 'react';
import {ScrollView} from "react-native";


export const Wrap = ({ children }: { children: React.ReactNode }) => {
  // const dispatch = useAppDispatch(); // need
  // const [loading, setLoading] = useState(false);
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
    <ScrollView horizontal={false} style={{ flex: 1 }}>
        <ScrollView horizontal={false} style={{ flex: 1 }}>
            {children}
            {/*<Background />*/}
        </ScrollView>
    </ScrollView>
  );
};
