 // Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
        // Call getToken in auth.js
        return await getToken();
    }
};
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
//Get user info from Graph
async function getUser() { 
    ensureScope('user.read');
    return await graphClient
        .api('/me')
        .select('id,displayName')
        .get();
}

async function getEvents(elem) { ///**************** 
    ensureScope('Calendars.Read');
    ensureScope('Calendars.ReadWrite');
    ensureScope('Calendars.Read.Shared');
    

    const dateNow = new Date();
    //console.log(dateNow);
    const formatted_date = dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + dateNow.getDate()


    const query = `startDateTime=2022-06-28T07:00:00.043Z&endDateTime=2022-06-28T20:00:00.043Z`; // pour afficher les évènements du jour
    //console.log(query); // au lieu de faire dateNow.toISOString() => startDateTime=2022-03-22T10:59:55.043Z&endDateTime=2022-03-29T09:59:55.043Z
    // startDateTime=${formatted_date}T07:00:00.043Z&endDateTime=${formatted_date}T20:00:00.043Z
    //test : startdatetime=2022-04-04T07:21:18.022Z&enddatetime=2022-04-11T18:21:18.022Z
    return await graphClient
    .api('/users/' + elem + '/calendarview').query(query) //*************** 
    .select('subject,start,end, attendees, organizer') // données à utiliser dans ui.js pour l'affichage
    .orderby(`start/DateTime`)
    .header('Prefer','outlook.timezone="Romance Standard Time"')
    .get();
  }
  