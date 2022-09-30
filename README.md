# 1-grid-assesment
Thank you very much for taking the time to review my application. This is the first time I'm building an application primarily built on Vue, and it is my first time ever using GraphQL. I really enjoyed this challenge and I want to thank you all for giving me this great learning opportunity

I unfortunately could not finish the complete assesment in time, and for that I sincerely apologise. I have everything running perfectly with my private repository, but I struggled to get the live application link with OAuth.

The work around that I have in place for this is to switch to my own repository when I want to add an issue. For this workaround, I switch between the repositorries in the graphql.js file, on line 12. I also included the .env in the repository just as an example of how I did my simple authentication (I would never do this in an actual realife environment, just thought I'd mention that). 

I am only aware of one real bug. When submitting an issue, the select dropdowns for Client, Priority and Type does get set to null, but the displayed option in the respective dropdowns aren't changed back to the default,

## Project setup
I installed the application using the VueJS CLI, Vue Apollo and TailwindCSS: 

-**[Vue Apollo]**(https://apollo.vuejs.org/) as it seemed that I needed it to run queries easier (again, my first time using GraphQL)

-**[Tailwind CSS]**(https://tailwindcss.com/) I adore using TailwindCSS as it allows me to make mobile friendly and good looking systems at a fraction of the time normal styling would take me

### Installation
Below are the commands that can be used to install. It is just the out of the box standard Vue CLI commands.

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
