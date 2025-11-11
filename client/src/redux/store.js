import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import videoReducer from "./slices/videoSlice";
import tweetReducer from "./slices/tweetSlice";
import subscriptionReducer from "./slices/SubscriptionSlice";
import playlistReducer from "./slices/playlistSlice";
import likeReducer from "./slices/likeSlice";
import commentReducer from "./slices/commentSlice";
import dashboardReducer from "./slices/dashboardSlice";
import healthcheckReducer from "./slices/healthcheckSlice";
import pageApearReducer from "./slices/pageAppear";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    video: videoReducer,
    tweet: tweetReducer,
    subscription: subscriptionReducer,
    playlist: playlistReducer,
    like: likeReducer,
    comment: commentReducer,
    dashboard: dashboardReducer,
    healthcheck: healthcheckReducer,
    pageAppear: pageApearReducer,
  },
});

export default store;
