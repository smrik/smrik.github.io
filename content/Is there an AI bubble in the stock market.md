---
{"publish":true,"title":"Is there an AI bubble in the stock market","created":"2025-11-05T21:54","modified":"2025-11-30T14:27","tags":["stock-market"],"cssclasses":""}
---

# Is there an AI bubble in the stock market

Recently, there has been a lot of talk about the so-called AI bubble on the US stock market. This is usually related to some companies with truly outrageous valuation multiples - namely Nvidia and Palantir, but also Meta and Alphabet. 

While I understand the valuations look scary, I do believe in AI and that most people underestimate what exponential growth truly look like. It is truly remarkable if we want to put it in perspective. This makes me remember an episode of Friends, in which Chandler is bragging about getting a new work laptop, which was at the time top of the line.

<div style="text-align: center;">
<iframe width="500" height="350" src="https://www.youtube.com/embed/V6dQxQBHiB0?si=Avyx5L9dvgI1sW1g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen align="center"></iframe>
</div>

> [!info] 
> **Chandler :** All right, check out this bad boy. 12 megabytes of RAM. 500 megabyte hard drive. Built-in spreadsheet capabilities and a modem that transmits at over 28,000 b.p.s.
> **Phoebe :** Wow. What are you gonna use it for?
> **Chandler :** [doggedly] Games and stuff.
> 
> *Friends, Season 2 Episode 8* -  [Script Source](https://www.fanfr.com/scripts/saison2/friendsgeneration2.php?nav=script&version=vo&episodescript=208) 

So this episode aired in November 16, 1995 [^1] as per IMDB. Almost exactly 30 years ago at the time of writing this blog. My smartphone (and most flagships) currently has 12 GB of RAM. My phone - not my laptop (which has 32 GB). That is 1000 times as much in 30 years. If this development trend stays the same, in another 30 years (2055), the common persons smartphone (well it probably won't actually used in the same way, but for the sake of the argument, let's just imagine) would have 12 TB of RAM. That is outrageous, more than the storage of some modern servers. 

# Progression of technology
![[Attachments/images/Pasted image 20251115224327.png|140px]]

Gordon Moore, co-founder of Intel Corporation, forecasted in 1965 that the number of components (transistors) per integrated circuit would keep doubling every year for at least the next decade. In 1975 he revised it to a doubling every two years, which works out to a CAGR of about 44%.

$$CAGR(\%) = \sqrt{\frac{Value_{\ t_{1}}}{Value_{\ t_{0}}}}-1 = \sqrt{\frac{2}{1}}-1= 44\%$$

Interestingly enough, this law applies to much more than just semiconductors. It has observed in [^2]:
- reduction in price/quality of microprocessors
- increases in RAM
- improvements of sensors
- number and size of pixels in digital cameras

## The progress of AI
So to get back to the question in the title (finally). I think that people tend to underestimate exponential growth in the future, and I believe that we do that systematically (interesting read: [Exponential growth bias: The numerical error behind Covid-19 (BBC Future)](https://www.bbc.com/future/article/20200812-exponential-growth-bias-the-numerical-error-behind-covid-19)). So to highlight this I have, like always, prepared a series of charts based on the data of Epoch AI[^3].

First to give some historical background, I made this:
![[Blog files/AIgrowth/outputs/AI_Compute_Growth.png]]

Since the advent of deep-learning the AI industry had a complete rebirth and now it is really growing at an impressive rate. I think some confusion comes from people being used to charts like this - just normal logarithmic charts which show a nice growth and it makes the increases hard to grasp, even if the titles say growth rate of 4.3 times per year for example - a growth of 343.82% (the number is a bit different than the graph because of rounding):
$$CAGR(\%) = \sqrt{\frac{Value_{\ t_{1}}}{Value_{\ t_{0}}}}-1 = \sqrt{\frac{2^{4.3}}{1}}-1= 343.82\%$$

![[Blog files/AIgrowth/outputs/training_compute_modern_models.png]]

But what is actually happening under the hood is this:

![[Blog files/AIgrowth/outputs/training_compute_notable_models_linear_absolute_frontier.png]]

Looking at this models like GPT-3 are completely irrelevant nowadays, they look miniscule. I thought that was quite interesting. There are some of the most iconic models on the above (logarithmic graph) like:
1. AlexNet, the model that is credited with kickstarting the Deep Learning revolution. It was the winner of image classification challenges in 2011 and 2012 by using neural networks instead of traditional hard-coded algorithms
2. AlphaGo Zero, which was DeepMind's (Google AI Lab) groundbreaking model that beat the best player at the game of Go - Lee Sedol (similar to how Garry Kasparov got beaten by DeepBlue in 1997
	- just as a side note, this is performance of Deep Blue compared to today's smartphones and the size comparison (AI generated)
	
> [!cite] Deep Blue vs. Modern Hardware
> ![[Attachments/Gemini_Generated_Image_wm9so2wm9so2wm9s.png|500]]
>
> | Hardware                          | Type           | Approx. Performance (GFLOPS) | Multiplier vs. Deep Blue |
> | --------------------------------- | -------------- | ---------------------------- | ------------------------ |
> | **Deep Blue (1997)**              | Supercomputer  | **11.38**                    | **1x**                   |
> | **Apple A17 Pro** (iPhone 15 Pro) | Smartphone GPU | ~2,150                       | ~190x                    |
> | **Snapdragon 8 Gen 3**            | Smartphone GPU | ~4,700 – 5,500               | ~400x – 480x             |
> | **Intel Core i9-14900K**          | Desktop CPU    | ~6,000                       | ~520x                    |
> | **NVIDIA RTX 4090**               | Consumer GPU   | ~82,600                      | ~7,250x                  |

3. GPT-3, the model that was the first one available in ChatGPT at the time of it's release.

## How this relates to the stock market?
Well there has been a lot of talk about stock market bubbles and how this AI-driven growth is similar to the dot-com bubble in the early 2000s. But I do think that this time it's different. It may take some time for AI to reach the level of humans, so looking back it's hard to see major progress for now. But once the level is reached, it won't just stop at that. After ~2.8 ($\frac{12}{4.3}$) months it will be double the performance of humans, in a year it will be $2^{4.3}=19.7$ times as good as the human. So one day you are working for 8 hours and the AI would take 24 hours to do your job. In a year, your 8 hour workday is completed in $\frac{24}{19.7}=1.22$ hours, which is 1 hour and 13 minutes. Then in another year, $\frac{24}{19.7^2}=0.062$ it gets completed in 3 minutes. Imagine the economic gains and productivity increases this could drive. 

Obviously this is all based on the assumption that the rate of progress will stay at current levels, which is probably unlikely. The law of diminishing marginal returns will probably come into play, so take this with a grain of salt. But the underlying logic is the same. I think that the growth is underestimated and there is no "bubble", just technological increases leading to higher productivity and I think that makes the valuations justified. In a next blog post, I will look into the Nvidia valuations specifically by looking into their market shares and how crucial they are to this entire ordeal.

---

I've been also trying out the `gganimate` package in R to try to make the visualisation that would transition from the logarithmic to linear scale. It its kind of buggy for now and looks a bit odd, but here it is:

![[Blog files/AIgrowth/outputs/training_compute_transition.gif]]


> [!info] 
>  ###### Some examples of similar laws
> ![[Attachments/images/Transistor-Count-over-time (1).png]]
> ![[Attachments/images/Pasted image 20251115231210.png]]


---
[^1]: [Friends (TV Series 1994–2004) - Episode list - IMDb](https://www.imdb.com/title/tt0108778/episodes/?season=2)
[^2]: [Moore's law - Wikipedia](https://en.wikipedia.org/wiki/Moore%27s_law)
[^3]: Epoch AI, ‘Data on AI Models’. Published online at epoch.ai. Retrieved from ‘https://epoch.ai/data/ai-models’ [online resource]. Accessed 29 Nov 2025.
