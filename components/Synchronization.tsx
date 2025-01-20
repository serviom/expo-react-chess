// import { useEffect, useState } from 'react';
// import { dialogsAction } from '@/features/dialog/dialogActions';
// import { StateType, useAppDispatch } from '@/features/store';
// import { useSelector } from 'react-redux';
// import { useSQLiteContext } from 'expo-sqlite';
// import { fetchDialogs, insertDialog } from '@/repositories';
// import dialogSlice from '@/features/dialog/dialogSlice';
//
// const sqlCreateDialogs =
//   'DROP TABLE IF EXISTS dialogs;' +
//   'DROP TABLE IF EXISTS messages;' +
//   'DROP TABLE IF EXISTS users;' +
//   'CREATE TABLE IF NOT EXISTS dialogs (' +
//   '  id TEXT PRIMARY KEY,' +
//   '  lastMessage TEXT, ' +
//   '  unreadMessagesCount INTEGER,' +
//   '  createdAt DATETIME NOT NULL,' +
//   '  updatedAt DATETIME NOT NULL' +
//   ');' +
//   'CREATE INDEX IF NOT EXISTS idx_createdAt ON dialogs (createdAt);' +
//   'CREATE INDEX IF NOT EXISTS idx_updatedAt ON dialogs (updatedAt);' +
//   'CREATE TABLE IF NOT EXISTS messages (' +
//   '  id TEXT PRIMARY KEY,' +
//   '  dialogId TEXT, ' +
//   '  userId TEXT NOT NULL,' +
//   '  data TEXT NOT NULL,' +
//   '  type TEXT NOT NULL,' +
//   '  createdAt DATETIME NOT NULL,' +
//   '  updatedAt DATETIME NOT NULL,' +
//   '  savedAt DATETIME NULL' +
//   ');' +
//   'CREATE INDEX IF NOT EXISTS idx_createdAt ON messages (createdAt);' +
//   'CREATE INDEX IF NOT EXISTS idx_dialogId ON messages (dialogId);' +
//   'CREATE TABLE IF NOT EXISTS users (' +
//   '  id TEXT PRIMARY KEY,' +
//   '  name TEXT, ' +
//   '  avatar TEXT NULL,' +
//   '  lastLoginAt DATETIME NULL' +
//   ');' +
//   'CREATE TABLE IF NOT EXISTS members (' +
//   '  id INTEGER PRIMARY KEY,' +
//   '  dialogId TEXT NOT NULL, ' +
//   '  userId TEXT NOT NULL' +
//   ');'+
//   'CREATE INDEX IF NOT EXISTS idx_dialogId ON members (dialogId);' +
//   'CREATE INDEX IF NOT EXISTS idx_userId ON members (userId);';
//
// export const Synchronization = ({ children }: { children: React.ReactNode }) => {
//   const dispatch = useAppDispatch();
//   const { tokens } = useSelector((state: StateType) => state.auth);
//   const [sync, setSync] = useState<boolean>(false);
//   const db = useSQLiteContext();
//
//   const loadDialogs = async (page: number) => {
//     return dispatch(dialogsAction({ page }))
//       .unwrap()
//       .then(async (dialogs) => {
//         for (const dialog of dialogs.data) {
//           insertDialog(db, { dialog });
//         }
//         dispatch(dialogSlice.actions.setDialogs({ dialogs: dialogs.data }));
//       });
//   };
//
//   useEffect(() => {
//     try {
//       db.withTransactionAsync(async () => {
//         await db.execAsync(sqlCreateDialogs);
//         setSync(true);
//       }).catch((e) => {
//         console.log('e', e);
//       });
//     } catch (e) {
//       console.log('error migration', e);
//     }
//   }, []);
//
//   useEffect(() => {
//     if (sync && tokens) {
//       loadDialogs(1);
//     }
//   }, [tokens, sync]);
//
//   console.log('sync', sync);
//   return <>{sync ? children : null}</>;
// };
