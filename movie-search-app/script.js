const search=document.getElementById('searchid');
const genre=document.getElementById('genreid');
const year=document.getElementById('yearid');
const srchbtn=document.getElementById('srchbtn');
const results=document.getElementById('resultsid');

async function fetchMovies(searchTerm,searchYear,searchGenre){
    results.innerHTML='';
    const API_KEY='your_api_key';
    const url=`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&y=${searchYear}&type=movie`;
    try{

   
    let res= await fetch(url);
    let data=await res.json();

    if (data.Response==='True'){
//          {
//   "Search": [ ... ],
//   "totalResults": "20",
//   "Response": "True"
// }
// {
//     "Search": [
//       {
//         "Title": "Inception",
//         "Year": "2010",
//         "imdbID": "tt1375666",
//         "Type": "movie",
//         "Poster": "https://someurl.com/inception.jpg"
//       },
        for(const movie of data.Search) {
            //for...of instead of foreach when uaing await with array.
                const detailsurl=`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`;
                let respo=await fetch(detailsurl);
                let info=await respo.json();
                if(searchGenre==='' || info.Genre.toLowerCase().includes(searchGenre.toLowerCase())){
                    // We use .includes() here because info.Genre is a single string that contains multiple genres, separated by commas 
                    let div=document.createElement('div');
                    div.classList.add('movie-card'); 
                    // You might want to add a class when a user performs an action (like clicking a button): and add styles to it
                    div.innerHTML=`<img src='${info.Poster!=='N/A'? info.Poster:'https://via.placeholder.com/150'}' width='150' height='200'/>
                    <h3>${movie.Title}</h3>
                    <h5>${movie.Year}</h5>
                    <button class='favbtn'><i class="fa-solid fa-heart"></i></button>`
                    ;
                    
                    //details of movie
                    div.addEventListener('click',()=>{
                        const modal=document.getElementById('moviemodal');
                        // visibility of entire screen modal container showing and hiding
                        const modalDetails=document.getElementById('modalDetails');
                        modalDetails.innerHTML=`
                        <img src="${info.Poster !=='N/A'? info.Poster:'https://via.placeholder.com/150'}" width='150' height='200'/>
                        <h3>Title:${info.Title}</h3>
                        <h4>Year:${info.Year}</h4>
                        <p>Plot:${info.Plot}</p>
                        <p><strong>Genre:</strong>${info.Genre}</p>
                        <p><strong>Actors:</strong>${info.Actors}</p>

                        `;
                        modal.style.display='block';
                       
                    })
                    document.querySelector('#closebtn').onclick=()=>{
                        document.getElementById('moviemodal').style.display='none';
                    }
                    
                    //add to favorites
                    let favbtn=div.querySelector('.favbtn');
                    
                    favbtn.addEventListener('click',(e)=>{
                        e.stopPropagation();//prevnt modal opening
                        const favorites=JSON.parse(localStorage.getItem('favorites')) || [];
                        const existinglist=favorites.some(movie=>movie.imdbID===info.imdbID);
                        if (!existinglist){
                          favorites.push({
                            poster:info.Poster,
                            Title:info.Title,
                            Year:info.Year,
                            imdbID:info.imdbID
                        });
                           localStorage.setItem('favorites',JSON.stringify(favorites));
                           alert('added to favorites');
                        }
                        else{
                            alert('already in favorites!')
                        }
                    })
                    
                        
                    




                    
                     results.appendChild(div);
                     window.onclick = function(event) {
                        const modal = document.getElementById('moviemodal');
                        if (event.target == modal) {
                          modal.style.display = 'none';
                        }
                      };
                     
                }
               

        };
    }
    else{
        results.innerHTML='something went wrong!'
    }

    //info abt http n https
}
catch(error){
    results.innerHTML=`${error},something went wrong`
}
} 

let viewbtn=document.getElementById('viewfav');
    viewbtn.addEventListener('click',()=>{
    const favorites=JSON.parse(localStorage.getItem('favorites')) || [];
    let favmodal=document.getElementById('favoritemodal');
    let favcontent=document.getElementById('favcontent');
    favcontent.innerHTML='';
    favorites.forEach(movie=>{
         const div=document.createElement('div')
        div.innerHTML=`
         <img src='${movie.poster}' width='200' height='150'/>
        ${movie.Title} ${movie.Year}`;
        
        let delbtn=document.createElement('button');
        delbtn.classList.add('del-btn')
        delbtn.textContent='Remove from favorite';
        delbtn.addEventListener('click',()=>{
        const updatedlist=favorites.filter(m=>m.imdbID !== movie.imdbID);
        localStorage.setItem('favorites',JSON.stringify(updatedlist));
        //if id not equal sends to updatedlist 
        div.remove();
    })
    div.appendChild(delbtn)
    favcontent.appendChild(div);


    
    
    
    })
    favmodal.style.display='block';
   
    

    

 })
 document.querySelector('#closeview').onclick=()=>{
    document.getElementById('favoritemodal').style.display='none'
}




srchbtn.addEventListener('click',()=>{
    let searchTerm=search.value.trim();
    if(!searchTerm){
        alert('enter a movie name');
        return;
    }
    let searchYear=year.value.trim();
    let searchGenre=genre.value.trim();
    fetchMovies(searchTerm,searchYear,searchGenre);
    
   
    
})


