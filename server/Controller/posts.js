const mongoose = require('mongoose');
const question = require('../models/question.js');
const users = require('../models/user.js');
const answers = require('../models/user.js');
const getPost= (req, res) => {
    res.send("Hello World!");
}

const postQuestion = async (req, res) => {
    const data = req.body;
    const newQuestion = new question(data);
    try {
        await newQuestion.save();
        await users.findByIdAndUpdate(newQuestion.userId, { $push: { questions: newQuestion._id } });
        res.status(200).json(1);
    } catch (error) {
        res.status(404).json(2);
    }
}

const getAllPosts = async (req,res) => {
    try {
        const answer = await answers.find();
        answer.sort(function(a,b){a.questionId<b.questionId});
        const questions = await question.find();
        questions.sort(function(a,b){a._id<b._id});
        const posts=[];
        for(let i=0,j=0,l=0;l<questions.size();i=j,++l)
        {
            while(questions[l]._id!=answer[i].questionId)
            {
                posts.push({question:questions[l],answer:[]});
                ++l;
            }
            let temp=[];
            while((j<answer.size())&&(answer[i].questionId===answer[j].questionId))
            {
                temp.push(answer[j]);
                ++j;
            }
            posts.push({question:question[l],answer:temp});
            ++l;
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = { getPost, postQuestion, getPost, getAllPosts };