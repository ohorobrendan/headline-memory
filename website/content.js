/* Sourced, original paraphrases. Original headlines are quoted once below.
   Precise headlines are authored experimental stimuli, not publisher headlines. */
window.STORIES = [
  {
    id: 'wine', topic: 'Wine & exercise', kicker: 'RESEARCH / PERFORMANCE', publisher: 'HuffPost UK', date: 'Archived 2015 report',
    originalHeadline: 'A Glass Of Red Wine Is The Equivalent To An Hour At The Gym, Says New Study',
    preciseHeadline: 'A compound found in red wine enhanced exercise training in rats',
    paragraphs: [
      'A University of Alberta research team investigated resveratrol, a substance present in red wine as well as some fruits and nuts. The research concerned a concentrated compound, rather than people drinking a glass of wine.',
      'In the 2012 experiment, male rats received either a standard diet or a diet containing resveratrol. Some rats also completed a treadmill-training program over 12 weeks. The researchers measured exercise performance, muscle strength and heart function. Resveratrol enhanced several benefits of exercise training in the animals.',
      'After reports circulated online, the university issued a clarification in 2015. The findings did not establish that a serving of wine replaces a workout in people. The possibility that the compound might eventually help people who have difficulty exercising was a research direction, rather than a demonstrated benefit of drinking wine.'
    ],
    takeaway: 'The experiment tested concentrated resveratrol in rats. It did not show that a glass of wine replaces human exercise.',
    sources: [
      {label: 'Original headline · archived HuffPost report', url: 'https://st551.cwick.co.nz/lecture/lecture_2_articles.pdf'},
      {label: 'University of Alberta · clarification, January 30, 2015', url: 'https://www.ualberta.ca/en/medicine/news/2015/january/resveratrol.html'},
      {label: 'Dolinsky et al. (2012) · original research', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3424731/'}
    ],
    questions: [
      {id:'wine_replace', type:'target', text:'What did the reported research establish about replacing a workout?', options:[
        {id:'fact', text:'It did not establish that a glass of wine replaces exercise in people.'},
        {id:'lure', text:'One glass of wine provides the same benefits as an hour at the gym.'},
        {id:'other', text:'Wine only replaces exercise when it is consumed after dinner.'},
        {id:'unknown', text:'I do not remember.'}
      ], explanation:'The brief says the university clarified that the findings did not establish a wine-for-workout substitution in people.'},
      {id:'wine_substance', type:'target', text:'What substance did researchers give the animals in their diet?', options:[
        {id:'fact', text:'Resveratrol, a concentrated compound also found in some foods.'},
        {id:'lure', text:'A normal serving of red wine.'},
        {id:'other', text:'A caffeinated energy drink.'},
        {id:'unknown', text:'I do not remember.'}
      ], explanation:'The animals received dietary resveratrol. The presence of this compound in wine does not make a serving of wine equivalent to the experimental treatment.'},
      {id:'wine_detail', type:'detail', text:'How long did the treadmill-training program last?', options:[
        {id:'fact', text:'12 weeks.'}, {id:'other1', text:'Two days.'}, {id:'other2', text:'One year.'}, {id:'unknown', text:'I do not remember.'}
      ], explanation:'The article describes a treadmill-training program lasting 12 weeks.'}
    ]
  },
  {
    id:'champagne', topic:'Champagne & memory', kicker:'RESEARCH / MEMORY', publisher:'The Independent', date:'November 9, 2015',
    originalHeadline:"Preventing dementia: Three glasses of Champagne 'could cut risk of developing Alzheimer's' - but why stop there",
    preciseHeadline:'Champagne study found better spatial memory in rats, without establishing dementia prevention in people',
    paragraphs:[
      'A story about champagne and memory attracted renewed attention online in 2015. The Independent reported on University of Reading research that had been published in 2013. Although the coverage discussed possible implications for dementia, the experiment itself involved rats.',
      'Over six weeks, aged rodents received champagne or comparison drinks matched for alcohol or energy. The team assessed spatial working memory, the ability to keep track of locations. Animals given champagne showed improvement on this measure compared with the control groups. Researchers also examined changes in proteins in brain regions associated with memory.',
      'These results concerned a particular memory task in animals. They did not demonstrate that drinking champagne prevents Alzheimer’s disease in humans. In its 2015 story, the newspaper noted that a recommendation for doctors to prescribe champagne remained far off and that it was seeking an update on possible human trials.'
    ],
    takeaway:'The reported memory improvement was in rats. The study did not establish that champagne prevents Alzheimer’s disease in people.',
    sources:[
      {label:'The Independent · original report, November 9, 2015',url:'https://www.the-independent.com/life-style/health-and-families/health-news/preventing-dementia-three-glasses-of-champagne-could-cut-risk-of-developing-alzheimer-s-but-why-stop-there-a6727486.html'},
      {label:'Corona et al. (2013) · original research',url:'https://pubmed.ncbi.nlm.nih.gov/23458470/'}
    ],
    questions:[
      {id:'champagne_subjects',type:'target',text:'Who showed improved memory in the experiment described?',options:[
        {id:'fact',text:'Rats tested on spatial working memory.'}, {id:'lure',text:'Older adults who drank champagne each week.'}, {id:'other',text:'Students who drank champagne before an exam.'}, {id:'unknown',text:'I do not remember.'}
      ],explanation:'The actual experiment used aged rodents. The possible human implications were discussed but were not established in a human trial.'},
      {id:'champagne_prevention',type:'target',text:'What did the experiment establish about Alzheimer’s disease in humans?',options:[
        {id:'fact',text:'It did not establish that champagne prevents the disease in humans.'}, {id:'lure',text:'Three glasses of champagne were shown to reduce people’s risk of the disease.'}, {id:'other',text:'Champagne reversed the disease in every participant.'}, {id:'unknown',text:'I do not remember.'}
      ],explanation:'An improvement on an animal memory task is not a demonstration of disease prevention in people. The original headline also used the qualifier “could.”'},
      {id:'champagne_detail',type:'detail',text:'When was the underlying research published, according to the story?',options:[
        {id:'fact',text:'2013, before the renewed attention in 2015.'}, {id:'other1',text:'2015, the same year as the renewed attention.'}, {id:'other2',text:'2001.'}, {id:'unknown',text:'I do not remember.'}
      ],explanation:'The article distinguishes the 2013 research publication from the renewed online attention in 2015.'}
    ]
  },
  {
    id:'coffee',topic:'Coffee & longevity',kicker:'RESEARCH / LONGEVITY',publisher:'Imperial College London News',date:'July 2017',
    originalHeadline:'Drinking coffee reduces risk of death from all causes, study finds',
    preciseHeadline:'European observational study links coffee drinking with lower mortality, without proving causation',
    paragraphs:[
      'Researchers at the International Agency for Research on Cancer and Imperial College London examined coffee habits and mortality in a large European study. The project included 521,330 people aged over 35 from 10 countries. Diet information came from questionnaires and interviews.',
      'After roughly 16 years of follow-up, the researchers compared mortality among groups reporting different coffee habits. They adjusted their analysis for factors such as smoking and diet. People reporting the highest coffee consumption had lower mortality than non-drinkers in the adjusted analysis.',
      'This was an observational study: researchers tracked existing habits rather than randomly assigning people to drink coffee. The association therefore did not establish that coffee itself caused the difference in mortality. The lead researcher emphasized those limitations and said the findings were not a basis for recommending that people change how much coffee they drink. More research, including intervention studies, was needed.'
    ],
    takeaway:'The study found an association. Tracking existing habits cannot by itself show that coffee caused lower mortality.',
    sources:[
      {label:'Imperial College London · original news report, July 2017',url:'https://www.imperial.ac.uk/news/180494/drinking-coffee-reduces-risk-death-from/amp/'},
      {label:'Gunter et al. (2017) · original research',url:'https://spiral.imperial.ac.uk/entities/publication/b11248e3-0900-4b6d-a427-0fe717299b76'}
    ],
    questions:[
      {id:'coffee_cause',type:'target',text:'What did the reported study establish about coffee and mortality?',options:[
        {id:'fact',text:'Coffee habits were associated with mortality; causation was not established.'}, {id:'lure',text:'Drinking coffee itself was proven to cause a lower risk of death.'}, {id:'other',text:'Coffee was shown to eliminate deaths from every cause.'}, {id:'unknown',text:'I do not remember.'}
      ],explanation:'The researchers tracked existing habits. Even after statistical adjustments, the association did not establish a cause-and-effect relationship.'},
      {id:'coffee_advice',type:'target',text:'What did the lead researcher recommend about changing coffee intake?',options:[
        {id:'fact',text:'The findings were not a basis for recommending a change in intake.'}, {id:'lure',text:'People should increase coffee intake to reduce their risk of death.'}, {id:'other',text:'Everyone should stop drinking coffee immediately.'}, {id:'unknown',text:'I do not remember.'}
      ],explanation:'The brief reports the researcher’s caution against using this observational finding to recommend a change in coffee intake.'},
      {id:'coffee_detail',type:'detail',text:'How many countries contributed participants to the study?',options:[
        {id:'fact',text:'10 European countries.'}, {id:'other1',text:'One country.'}, {id:'other2',text:'50 countries worldwide.'}, {id:'unknown',text:'I do not remember.'}
      ],explanation:'The study included participants from 10 European countries.'}
    ]
  }
];
