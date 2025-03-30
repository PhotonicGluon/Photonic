**The Challenge**: a gauntlet of 14 mathematics questions that are to be solved within 15 minutes.

# What is *The Challenge*?

*The Challenge* is a web app which creates 14 mathematics questions which is to be solved within 15 minutes, whilst the
tune
of [Edvard Grieg's Peer Gynt Suite No. 1, Op. 46](https://en.wikipedia.org/wiki/Peer_Gynt_(Grieg)#Suite_No._1,_Op._46)
plays in the background.

The 14 questions will test on different aspects of mathematics, ranging from simple arithmetic to algebra to logarithms
to basic calculus.

# History

This is the first web-based project that I tried out. In addition to using Flask for the server backend and HTML, CSS,
and JavaScript for the frontend, I also used [SymPy](https://www.sympy.org/en/index.html) to parse and interpret user
input as mathematical commands.

This was also the first time when I tried to package the server components together as a release bundle. Pre-building
the resources needed to host a server allowed for easier setup and configuration of *The Challenge*.
