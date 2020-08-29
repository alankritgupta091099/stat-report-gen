const axios = require('axios');

module.exports = {
    fetchFollowerCount: fetchFollowerCount
}

//fetch followers from the instagram API
async function fetchFollowerCount(res,res){

    let username = await convertProfileLink("https://instagram.com/ekta_gambhir99?igshid=9de5xalc9h2q");//add link of user profile of username
    console.log("Insta Username: ",username);
    let instaLink=`https://www.instagram.com/${username}/?__a=1`
    axios.get(instaLink)
        .then((response)=>{
            if(response.status==200){
                console.log("Follower count of "+username+" :",response.data.graphql.user.edge_followed_by.count)
                res.status(200).json({"followersCount":response.data.graphql.user.edge_followed_by.count})
            }else{
                res.status(404).json({"Error":"User does not exist"})
            }
        })
        .catch(err=>{
            console.log(err)
            if(err.response.status==404) res.status(500).json({msg:"User Not Found"});
            else res.status(500).json({msg:"Something Went Wrong"});
        })
}

//If profile link => convert to username and return
//else other option is username => returrn it directly
function convertProfileLink(url){
    var urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
    if(urlParts[0].toLowerCase()=='instagram.com' || urlParts[0].toLowerCase()=='www.instagram.com')
        return urlParts[1]
    return urlParts[0]
}