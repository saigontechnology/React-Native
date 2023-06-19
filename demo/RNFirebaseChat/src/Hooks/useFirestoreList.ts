import {useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

//Collection firebase
interface Params<T> {
  collection: string;
  orderBy?: string;
  orderDirection?: string;
  condition?: any;
  callback?: (arrs: T[]) => Array<any>;
  limit?: number;
  isTurnOffIndicator?: boolean;
}

interface Result<T> {
  data: Array<T>;
  status: {
    loading: boolean;
    ended: boolean;
    pullToRefresh: boolean;
  };
  fetchMore: () => void;
  fetchRefresh: () => void;
}

const LIMIT = 20;

export default function useFirestoreList<T>(
  {
    collection,
    orderBy = 'created',
    orderDirection = 'desc',
    limit,
    condition,
    callback,
    isTurnOffIndicator = true,
  }: Params<T>,
  deps = [],
): Result<T> {
  // const dispatch = useDispatch();

  // const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [data, setData] = useState<Array<any>>([]);
  const [ended, setEnded] = useState(false);
  const [focused, setFocused] = useState(false);
  //Refresh dependencies
  const [refresh, setRefresh] = useState(false);
  //Pull to refresh status
  const [pullToRefresh, setPullToRefresh] = useState(false);
  const status = useRef({page: 0, subscribed: true});
  const currentData = useRef<any>(null);

  async function listNextPage(
    collection,
    data,
    type = 'created',
    order = 'desc',
    limit = LIMIT,
    condition = null,
  ) {
    try {
      if (data.docs.length == limit) {
        let lastData = await data.docs[data.docs.length - 1];
        let nextData = null;

        if (condition && Object.keys(condition).length > 0) {
          nextData = await firestore()
            .collection(collection)
            .where(condition.type, condition.operator, condition.params)
            .orderBy(type, order)
            .startAfter(lastData)
            .limit(limit)
            .get();
        } else {
          nextData = await firestore()
            .collection(collection)
            .orderBy(type, order)
            .startAfter(lastData)
            .limit(LIMIT)
            .get();
        }
        return nextData;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async function listData(
    collection,
    type = 'created',
    order = 'desc',
    limit = LIMIT,
  ) {
    return await firestore()
      .collection(collection)
      // .orderBy(type, order)
      // .limit(limit)
      .get();
  }

  useFocusEffect(() => {
    if (!focused) {
      setFocused(true);
    }
  });

  const fetchMore = async () => {
    if (!ended && !loading && status.current.subscribed) {
      setLoading(true);
      const res = await listNextPage(
        collection,
        currentData.current,
        orderBy,
        orderDirection,
        limit,
      );
      if (res) {
        currentData.current = res;
        const newArray = [] as any;
        res.forEach(doc => {
          newArray.push(doc.data());
        });
        if (newArray.length > 0) {
          asyncRequest(true, newArray);
          setLoading(false);
        } else {
          setEnded(true);
          setLoading(false);
        }
      }
      setEnded(true);
    }
  };

  const fetchRefresh = () => {
    setData([]);
    setRefresh(!refresh);
    setLoading(true);
    setEnded(false);
    setPullToRefresh(true);
    asyncRequest(true);
  };

  const asyncRequest = async (subscribe: boolean, data?: Array<any>) => {
    try {
      if (subscribe) {
        // firstTimeLoading && dispatch(setGlobalIndicatorVisibility(true));
        if (data) {
          setData(prevState => [...prevState, ...data]);
        } else {
          const res = await listData(
            collection,
            orderBy,
            orderDirection,
            limit,
          );
          currentData.current = res;
          const newArray = [] as any;
          res.forEach(doc => {
            newArray.push({id: doc.id, ...doc.data()});
          });

          if (callback) {
            console.log("useFirestoreList",callback(newArray));
            setData(callback(newArray));
          }
          else setData(newArray);

          if (newArray.length == 0) {
            setEnded(true);
          }
        }
        setPullToRefresh(false);
        setFirstTimeLoading(false);
        // isTurnOffIndicator && dispatch(setGlobalIndicatorVisibility(false));
        setLoading(false);
      }
    } catch (e) {}
  };

  useEffect(() => {
    status.current.subscribed = true;
    setLoading(true);
    asyncRequest(status.current.subscribed);

    return () => {
      status.current.subscribed = false;
    };
  }, [...deps, refresh]);

  return {
    data,
    status: {loading, ended, pullToRefresh},
    fetchMore,
    fetchRefresh,
  };
}
