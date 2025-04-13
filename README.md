# 🌍 react-native-custom-map

A lightweight and customizable **React Native map component** powered by **WebView**.  
Easily integrate **Google Maps** or **OpenStreetMap** into your Expo or React Native apps with just a few lines of code.

> 📌 Perfect for simple map visualizations, location previews, and coordinate-based views in your mobile apps.

---

## 🚀 Features

✅ Supports **Google Maps** and **OpenStreetMap**  
✅ Simple props-based API  
✅ Built with `react-native-webview`  
✅ Works with **Expo** and **React Native CLI**  
✅ Lightweight & easy to extend

---

## 📦 Installation

Install via npm or yarn:

```bash
npm install react-native-custom-map
```

import React from 'react';
import { View } from 'react-native';
import CustomMap from 'react-native-custom-map';

export default function App() {
return (
<View style={{ flex: 1 }}>
<CustomMap
        latitude={40.9919}
        longitude={29.1248}
        zoom={14}
      />
</View>
);
}
