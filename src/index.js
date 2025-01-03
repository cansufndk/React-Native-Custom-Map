import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

const MapView = ({ latitude, longitude, zoom = 10, markers = [], apiKey, onMarkerDragEnd }) => {
  const googleMapsHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"></script>
        <script>
          let map;

          function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
              center: { lat: ${latitude}, lng: ${longitude} },
              zoom: ${zoom}
            });

            ${markers
              .map(
                (marker) => `
                  var marker = new google.maps.Marker({
                    position: {lat: ${marker.lat}, lng: ${marker.lng}},
                    map: map,
                    title: '${marker.title}',
                    draggable: true
                  });

                  google.maps.event.addListener(marker, 'dragend', function(event) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      title: marker.title,
                      lat: event.latLng.lat(),
                      lng: event.latLng.lng()
                    }));
                  });
                `
              )
              .join('')}
          }

          function updateMapCenter(lat, lng) {
            if (map) {
              map.setCenter({ lat, lng });
            }
          }
        </script>
      </head>
      <body onload="initMap()">
        <div id="map"></div>
      </body>
    </html>
  `;

  const webViewRef = React.useRef(null);

  useEffect(() => {
    if (webViewRef.current) {
      const script = `updateMapCenter(${latitude}, ${longitude});`;
      webViewRef.current.injectJavaScript(script);
    }
  }, [latitude, longitude]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: googleMapsHTML }}
        style={styles.map}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (onMarkerDragEnd) {
            onMarkerDragEnd(data);
          }
        }}
      />
    </View>
  );
};

MapView.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  zoom: PropTypes.number,
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      title: PropTypes.string,
    })
  ),
  apiKey: PropTypes.string.isRequired,
  onMarkerDragEnd: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapView;
