import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

const MapView = ({ latitude, longitude, zoom = 10, markers = [], apiKey }) => {
  const markersScript = markers
    .map(
      (marker) =>
        `var marker = new google.maps.Marker({
          position: {lat: ${marker.lat}, lng: ${marker.lng}},
          map: map,
          title: '${marker.title}',
          draggable: true 
        });


        google.maps.event.addListener(marker, 'dragend', function(event) {
          console.log('New position: ', event.latLng.lat(), event.latLng.lng());
        });
        `
    )
    .join('\n');

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
          function initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
              center: { lat: ${latitude}, lng: ${longitude} },
              zoom: ${zoom}
            });
            ${markersScript} // Marker'ları buraya ekliyoruz
          }
        </script>
      </head>
      <body onload="initMap()">
        <div id="map"></div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: googleMapsHTML }}
        style={styles.map}
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