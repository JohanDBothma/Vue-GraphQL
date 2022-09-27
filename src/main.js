// https://www.apollographql.com/blog/frontend/getting-started-with-vue-apollo/
// https://github.com/skevy/graphiql-app
// cannot make site iwthout tailwind
import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import App from "./App.vue";
import "./style.css";

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
	cache,
	uri: "https://api.github.com/graphql",
	headers: {
		Authorization: `Bearer ${process.env.VUE_APP_GITHUB_TOKEN}`,
	},
});

const app = createApp({
	setup() {
		provide(DefaultApolloClient, apolloClient);
	},

	render: () => h(App),
});

app.mount("#app");
