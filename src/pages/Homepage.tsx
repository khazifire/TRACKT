import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonBadge,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { Entry, toEntry } from "../model";
import { useAuth } from "../auth";
import { add as addIcon} from 'ionicons/icons';
import moment from 'moment';
import "./settingPage.css"

const HomePage: React.FC = () => {
  const { userId } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [entries2, setEntries2] = useState<Entry[]>([]);
  const [totalNumOfActi, settotalNumOfActi]=useState<number>()



  useEffect(() => {
    const entriesRef = firestore.collection('users').doc(userId).collection('UserInfo');
    return entriesRef.onSnapshot(({docs})=> setEntries2(docs.map(toEntry)));   /*  checks for new data on firestore */  
      }, [userId]);

  useEffect(() => {
    const entriesRef = firestore.collection('users').doc(userId).collection('TracktUserRecords');
     console.log('You are in HomePage',  entriesRef);
     
    return entriesRef.orderBy('date','desc').limit(7).onSnapshot(({docs})=> setEntries(docs.map(toEntry)));   /*  checks for new data on firestore */  
      }, [userId]);
      const formatDate = (inputDate: string) => {
        const date = moment(inputDate);
        return (
          date.format('MMMM DD, YYYY')
        );
      }
 
  const total = firestore.collection('users').doc(userId).collection('TracktUserRecords').get().then(function(querySnapshot) {      
        console.log('number of doc:', querySnapshot.empty); 
        settotalNumOfActi((querySnapshot.size)-1)
        console.log(total);
       
 });  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonTitle>Dashboard</IonTitle>
      
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
      {entries2.map((entry) => 
        <IonLabel>
          <h1 className="h1-text">Welcome back @{entry.UserName}</h1>
          <h2></h2>
        </IonLabel> )}

        <IonCard>
            <IonItem>
              <IonLabel>
               Number of records:
              </IonLabel>
              <IonBadge color="secondary" slot="end">{totalNumOfActi}</IonBadge>
            </IonItem>

            <IonItem>
              <IonLabel>
               Total tracked Time:
              </IonLabel>
              <IonBadge color="secondary" slot="end">#!</IonBadge>
            </IonItem>

          </IonCard>  {/* )}  */}
          
           
          <IonList>
          {entries.map((entry) =>
              <IonItem button key={entry.id} routerLink={`/my/entry/${entry.id}`}>

                <IonLabel>
                  <h1> {formatDate(entry.date)}</h1>
                  <h2> {entry.title}</h2>
                </IonLabel>  

              </IonItem>
      )}
            </IonList>

              <IonFab vertical="bottom" horizontal="end">
                <IonFabButton routerLink="TimeTracker">
                  <IonIcon icon={addIcon} />
                </IonFabButton>
              </IonFab>
    
            
        
              </IonContent>  
    </IonPage>
  );
};

export default HomePage;
