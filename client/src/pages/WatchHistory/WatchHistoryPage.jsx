import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchHistory } from "../../redux/slices/userSlice";

const WatchHistoryPage = () => {
  const dispatch = useDispatch();
  const { watchHistory } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchWatchHistory());
  }, [dispatch, watchHistory]);

  console.log(watchHistory);

  return <div>WatchHistoryPage</div>;
};

export default WatchHistoryPage;
