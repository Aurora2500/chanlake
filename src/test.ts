import {parse} from "./parse.js";

const texts = [
	"<a href=\"#p31422727\" class=\"quotelink\">&gt;&gt;31422727<\/a><br><span class=\"quote\">&gt;Thanks again Junko for making the thread for me.<\/span><br>picrel<br><span class=\"quote\">&gt;Exhaustion?<\/span><br>I don&#039;t even know anymore, I just want a hard reset on my life or something, it feels i&#039;ve sank too deep or something.",
	"<a href=\"#p31418059\" class=\"quotelink\">&gt;&gt;31418059<\/a><br>I never thought it would be a bad idea, the difficulty comes in my father being a reliable person for once... He&#039;s not very well known for his consistency and he&#039;s abandoned me multiple times as a child already lol. It&#039;s waiting for him and he isn&#039;t very communicative.",
	"qott: do you prefet hot or cold showers? <br>qott2: why did you let the last thread die? it&#039;s fucking 4am here lol i&#039;m about to sleep. this thread had better be up when i wake or i will be very disappointed <br><br>thread theme: https:\/\/youtu.be\/W2Du1n981gE<br><br>Previous Thread: <a href=\"\/lgbt\/thread\/31592409#p31592409\" class=\"quotelink\">&gt;&gt;31592409<\/a><br><br>Tagmap: https:\/\/tagmap.io\/tag\/%2Fbigen%2F<br><br>FAQ<br><span class=\"quote\">&gt;Am I bi if I like women and femboys\/traps?<\/span><br><span class=\"quote\">&gt;Am I bi if there&#039;s this one member of the same-sex I&#039;m desiring, but normally I like the opposite sex?<\/span><br><span class=\"quote\">&gt;Am I bi if I sexually like both sexes, but only interested in romance with one of them?<\/span><br>Yes, sexual attraction to both sexes is bisexuality.<br><span class=\"quote\">&gt;Do you love me, OP?<\/span><br>always have, always will<br><span class=\"quote\">&gt;Am I bi or pan if I like trans people?<\/span><br>Both are able to be attracted to trans people.<br><span class=\"quote\">&gt;What&#039;s the difference between bisexual and pansexual?<\/span><br>Just that our flag is prettier<br><br>Resource for Bisexuals:<br>https:\/\/biresource.org\/",
];

texts.forEach((text, i) => {
	console.log(`--- ${i} ---`);
	console.log(parse(text));
	
});