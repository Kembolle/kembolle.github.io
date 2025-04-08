<script>
    .geolocation.getCurrentPosition((pos) => {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;

    // Salva no localStorage
    localStorage.setItem('gps_lat', latitude);
    localStorage.setItem('gps_lng', longitude);

    console.log("Localização salva com sucesso!");
}, (err) => {
    console.error("Erro ao obter localização:", err);
});
</script>
