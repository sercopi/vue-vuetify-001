<template>
<v-app>
    <v-app-bar app color="primary" dark>
        <router-link to="/">Home</router-link>
    </v-app-bar>

    <v-main>
        <router-view></router-view>
    </v-main>
</v-app>
</template>

<script>
export default {
    name: "App",

    data: () => ({
        //
    })
};
</script>
