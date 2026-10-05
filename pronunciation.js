export function audioKey(text){
 return String(text).replace(/[’‘]/g,"'").replace(/[.!?,]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
}

// Give the textbook's abbreviated alternatives complete, speakable examples.
export function practiceExpressions(expression){
 const alternatives=expression.split(/\s*\/\s*/);
 return alternatives.map((text,index)=>{
  let sample=text.replace(/\(years old\)/g,'years old');
  if(index&&/^an eraser/.test(sample))sample=`I have ${sample}`;
  if(index&&/^(dog|panda)\.?$/.test(sample))sample=`It's a ${sample}`;
  if(/some …/.test(sample))sample=sample.replace('…','milk');
  else if(/How many …/.test(sample))sample=sample.replace('…','plates');
  else if(/This is …/.test(sample))sample=sample.replace('…','my puppet.');
  else sample=sample.replace('…','Bella.');
  return sample;
 });
}
