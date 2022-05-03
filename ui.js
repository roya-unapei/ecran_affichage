async function aff(h){
  for (var i =1; i<=4; ++i){
    var j = h-1;
    document.getElementById('diH' + j + i).style.backgroundColor = '#9FB475';
    document.getElementById('diH' + h + i).style.backgroundColor = "#C9D8AB";
  }
}
async function displayUI() {    
    
 
  if ( sessionStorage.getItem('msalAccount')!= "ephemeride@unapei.org"){
     console.log("***************" + sessionStorage.getItem('msalAccount'));
    await signIn();
  }
  

    // Display info from user profile
    const user = await getUser();
    /*var userName = document.getElementById('userName');
    userName.innerText = user.displayName;  */

    // Hide login button and initial UI
    /*var signInButton = document.getElementById('signin');
    signInButton.style = "display: none";
    var content = document.getElementById('content');
    content.style = "display: block";*/

    var salles = [ "SalleCA@unapei.org",  "ComCour@unapei.org","rdc12personnes@unapei.org", "ComRue@unapei.org"]; // "f.byrski@unapei.org" "Rapidmooc@unapei.org"
    
    var i =1;
    salles.forEach(elem => {
      //console.log(elem);
      displayEvents(elem, i); // permet d'afficher les calendriers
      ++i;
    });
}

async function displayEvents(elem1, i) { 
    var events = await getEvents(elem1); 
    //console.log("Salle réunion : " + elem1);
    
    /*if (!events || events.value.length < 1) {
      var content = document.getElementById('content');
      var noItemsMessage = document.createElement('p');
      noItemsMessage.innerHTML = `No events for the coming week!`;
      content.appendChild(noItemsMessage)
  
    } else {*/
      var wrapperShowEvents = document.getElementById('eventWrapper');
      wrapperShowEvents.style.display = "block";
      wrapperShowEvents.style.marginRight = "2%";
      var itemm = document.createElement("div"); 
      itemm.setAttribute("id", "di"+i);

      //css des div
      itemm.style.display = "flex";
      itemm.style.flex = "1 0 0"; // taille identique des div
      itemm.style.marginBottom = "2%";
      
      var divSalle = document.createElement("div"); 
      divSalle.setAttribute("id", "divSalle"+i);

      var nomSalle = document.createElement("p");
      nomSalle.setAttribute("id", "nomSalle");

      //css des titres
      nomSalle.style.fontWeight = "bold";
      nomSalle.style.textAlign = "center";
      nomSalle.style.fontSize = "1.2em";
      nomSalle.style.fontFamily = "Open Sans, sans-serif";
      nomSalle.style.margin = "auto";
      nomSalle.style.transform = "rotate(0.75turn)";


      divSalle.style.backgroundColor ="hsl(84, 29%, 90%, 0.5)";
      divSalle.style.display = "flex";
      divSalle.style.width ="6em";
      divSalle.style.overflow = "hidden";


      itemm.style.backgroundColor = '#9FB475';
      switch(elem1){
        case "SalleCA@unapei.org" :
          nomSalle.innerHTML = "CA";
          break;
        case "ComCour@unapei.org" :
          nomSalle.innerHTML = "COUR";
          /*var img = document.createElement("img");
          img.src = "./images/flecheD.png";
          img.style.width= "70%";
          img.style.height= "30%";
          img.style.paddingTop = "230%";
          img.style.objectPosition = "bottom";
          img.style.marginLeft = "15%";
          divSalle.appendChild(img);*/
          break;
        case "rdc12personnes@unapei.org" :
          nomSalle.innerHTML = "RDC 12";
          break;
        case "ComRue@unapei.org" :
          nomSalle.innerHTML = "RUE";
          break;
        default :
          nomSalle.innerHTML = "SALLE";
          itemm.style.backgroundColor = '#9FB475';
    }
      
      document.getElementById("eventWrapper").appendChild(itemm);
      document.getElementById("di"+i).appendChild(divSalle);
      document.getElementById("divSalle"+i).appendChild(nomSalle);

      //création div pour les horaires // faire une boucle pour créer toutes les div
      const eventsElementH = document.createElement('div');
      for (var k = 8; k <= 18; k++) {
        const eventsElementH = document.createElement('div');
        eventsElementH.setAttribute("id", "diH"+k+i);
        eventsElementH.style.maxHeight = "175px";
        eventsElementH.innerHTML = '';
        eventsElementH.style.width = "170px";
        eventsElementH.style.textAlign = "center";
        eventsElementH.style.borderLeft = "1px solid #7BA05B";
        eventsElementH.style.fontFamily = "Open Sans, sans-serif ";
        //eventsElementH.style.overflow = "hidden"; //dépassement div  
        //eventsElementH.style.wordBreak = "break-all"; // passe à la ligne si dépasse div
        itemm.appendChild(eventsElementH);
      }


     // Evènements (réunions)
      /*if (!events || events.value.length < 1) {
          var eventList = document.createElement('p');
          eventList.innerHTML = `Pas de réunion`;
          document.getElementById("diH14"+i).appendChild(eventList);
          
          
      }else {*/
        events.value.forEach(event => { // boucle pour afficher tous les évènements
            //console.log("affichage des réunions");
          var heureD = new Date(event.start.dateTime).toLocaleTimeString([], {hour: '2-digit'});
          var heureF = new Date(event.end.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
          var query = "<font size='1' >"+`${new Date(event.start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} à ${new Date(event.end.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} ` + "</font><br><b><font color = 'white'> <font size = '2'>" + `${event.subject}` + "<br></b></font></font><p align = 'center' ><font size='1' >" + `Resp : ${event.organizer.emailAddress.name}` + "</font></p>";
          var eventList = document.createElement('p');

          const eventsElement = document.createElement('div'); 
          eventsElement.style.height = "175px";
          eventsElement.innerHTML = '';
          eventsElement.style.marginLeft = "1.5em";
          eventsElement.style.width = "10em";
          eventsElement.style.textAlign = "center";
            
          const myArrayD = heureD.split(" "); // récupérer l'heure sans le h
          //console.log("*************" + heureF); // récupère 10:30
          const myArrayF = heureF.split(":"); // récupère 10 et 30
          //console.log("*************" +myArrayF[0] + " " + myArrayF[1]);
          //console.log("*************" + myArrayD[0]);

         /* if (myArrayF[0]%myArrayD[0] == 0 || myArrayF[0]%myArrayD[0] == 1 ){
            console.log("************* Réunion de 1h : f: " + myArrayF[0] + " d : "+myArrayD[0]);
          }else {
            console.log("************* Réunion sup à 1h :f: " + myArrayF[0] + " d : "+myArrayD[0]);
          }*/

          if (myArrayD[0] == 08){
            eventList.innerHTML = query;
            document.getElementById("diH8"+i).appendChild(eventList);
          }else if (myArrayD[0] == 09){
            eventList.innerHTML = query;
            document.getElementById("diH9"+i).appendChild(eventList);
          }else if (myArrayD[0]>18 ){
            eventList.innerHTML =  query;
            eventsElement.style.borderLeft = "1px solid #7BA05B";
            eventsElement.appendChild(eventList);
            itemm.appendChild(eventsElement);
          }else {
            eventList.innerHTML = query;
            document.getElementById("diH"+myArrayD[0] +i).appendChild(eventList);
          }
        });
      //}
  }