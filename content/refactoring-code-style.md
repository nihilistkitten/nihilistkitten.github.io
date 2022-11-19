+++
title = "Basic Notes on Refactoring and Code Style"
date = 2021-11-08
[taxonomies]
tags = ["python", "development", "tech"]
+++

These are notes from a workshop I co-ran for students in Reed College's introductory CS course, [CS121](https://jimfix.github.io/csci121/), which I TA. They assume some basic familiarity with python. The purpose is to teach some fundamental principles of code style through the lens of refactoring. Because obviously what the world needs most is more unqualified people writing informal blog posts about development, I thought I'd post them here ;).

<!-- more -->

## Introduction

Refactoring is a process through which we make small, incremental changes to a piece of code, _without changing its external functionality_. Refactoring lets us improve the quality and structure of our code in order to make it easier to read, to modify, or to maintain. We're going to work through a simple piece of code, refactoring it step-by-step, and along the way we're going to talk about various fundamental ideas behind good code style.

This is probably best read as an interactive experience. Think about each piece of code we show you and decide what changes you would make to it; maybe even download the code and make the changes on your machine. There are several times where we'll ask you explicitly to think about some questions: try to do so before you keep reading and see our answer. Also, think critically about what we tell you. While much of this comes from (our understanding of) the accumulated wisdom of several generations of programmers, there's also a significant degree of subjectivity in evaluating the quality of code.

## Some Bad Code

We're going to start by looking at an example of pretty bad code:

```python
i=0
j=1
print(j)
i,j=j,i+j
print(j)
i,j=j,i+j
print(j)
i,j=j,i+j
print(j)
i,j=j,i+j
print(j)
i,j=j,i+j
print(j)
i,j=j,i+j
print(j)
i,j=j,i+j
print(j)
```

_Question: what is this code doing? Answer this without actually running the code in the terminal._

This code prints the first eight [Fibonacci numbers](https://en.wikipedia.org/wiki/Fibonacci_number){{ footnote(content="I'm starting from 1, which is not standard (usually you'd start with 0), just because it makes the code a little cleaner.") }}. To do so, it relies on this "simultaneous assignment" notation, `i,j=j,i+j`, which updates `i` and `j` simultaneously in the way you'd expect, following the Fibonacci recursion.

```shell
$ python fib.py
1
1
2
3
5
8
13
21
```

One aspect of refactoring is that you want to make sure you don't break your code, since the whole point is to improve it without changing its behavior. Later, we're going to write _unit tests_, which will help us verify this automatically. For now, I suggest running the file after every modification you make and ensuring it has _precisely_ the same command-line behavior.

_Question: what are some issues with this code?_

## Repetition

This code does the same thing a bunch of times. We can easily rewrite this in a loop:

```python
i=0
j=1

k=0
while k<8:
    print(j)
    i,j=j,i+j
    k+=1
```

This is an example of a basic principle of coding, called "Don't Repeat Yourself," or _DRY_.{{ footnote(content="Like most principles, this is not absolute: you might not always want to deduplicate repeated code. One possible reason it might be is if code is duplicated by coincidence. Sometimes you have two pieces of code that look the same, but they're subject to different requirements, and so if you deduplicate via a loop or function, you could end up needing to undo that change later in the line. If you're not careful, you can end up with functions with 80 different optional arguments, each of which makes a small change to the behavior, because you tried to cram all of your seemingly duplicated code into functions, and then later needed to add arguments to configure the behavior of the function. One solution to this is _WET_, or write everything twice, an alternative to DRY. It holds that the first two duplications might be a coincidence, but the third probably indicates there's some fundamental commonality between the problems you're trying to solve, and so after the third duplication you should start deduplicating.") }}

_Question: Why might we want to avoid repeating ourselves?_

- Modifiability: say it turns out that we no longer want to print the numbers, but instead write them to a file. With the repeated version, you'd need to change all eight occurances of `print` to make this change. It might seems easy here, but imagine if this was a thousand-line-long piece of code and the `print`s were scattered throughout.{{ footnote(content="This will be a common theme throughout: we're working on a pretty simple example of code, and so while you could see why these changes might be useful, it's kind of hard to see them as necessary for code like this. So we'll use this fibonacci code as an example of what these changes look like, and sometimes we'll need to talk more abstractly about why they're useful.") }}
- Error proneness: if one of our eight copies of the same code had a typo (say, it switched `i` and `j`), it would be very difficult to catch and debug.
- Readability: every time we update `i` and `j`, we do it on the same line of code. This makes it easy to understand the relationship `i` and `j` have to each other.

## Naming

`i`, `j`, and `k` are not particularly easy to keep track of; it's easy to mistake `i` for `j` in particular.

_Exercise: think of better names._

```python
prev=0
curr=1

count=0
while count<8:
    print(curr)
    prev,curr=curr,prev+curr
    count+=1
```

This is an example of a _readability_ refactor; its purpose is to make the code easier to read at a glance.

_Question: why do we care about readability?_

- Code review: anyone reading with your code, be it your friends or professors or future-evil-corporate-boss (or your friendly TA graders! :P) will find it much easier if they can... you know... read the code easily. That will let them spend more mental energy helping you and less mental energy asking questions like "what did that variable mean again?"
- Other maintainers: similarly, you'll often not be the only one _writing_ the code. Following naming conventions is super important in collaborative projects, because even if the name makes sense to you ("I always use `l` for a list, why can't I do that?"), it won't make sense to your collaboratos.
- Future you: one important lesson from development is that, even on solo projects, you should treat _future you_ like another person. In a week, you won't remember a single thing about the specific choices you make writing this code; nevermind in a month or five years. Make sure your code is readable for your own sake.

That said, three things to keep in mind with variable names:

- _Convention_. The names `prev` and `curr` are conventionally used for this kind of iterative procedure when you need to keep track of the two previous values. Many programmers will automatically know the meanings of variables like `prev` and `curr` just from their names because they've read other code that used those same conventions. Other examples of this: `n` for some kind of bound, `ret` or `out` for the value that's going to be returned at the end, `self` for the reciever of a method. In 121 we've used `xs` for a list of numbers.
- _Length_. Avoid one-letter names except in rare cases (a very short loop index, or `n` for a bound). Also avoid unnecessarily long names like `the_fibonacci_number_that_i_calculated_previously`.
- _Word Delineation_. `thepreviousnumber` is harder to read than `thePreviousNumber` or `the_previous_number`. The first style is called "camelCase" and the second is "snake_case". {{ footnote(content="In Python, there's technically a [convention](https://www.python.org/dev/peps/pep-0008/#prescriptive-naming-conventions) to make almost everything snake_case, except for class names, which should be PascalCase (camelCase but with the first word also capitalized), and constants, which should be UPPER_CASE. But I might be the only one in the world who cares: as long as you're consistent within your own code, the specific convention is probably not so important.") }}

## Spacing

Another readability issue: this code doesn't use any spacing between operators. Here's a better version:

```python
prev = 0
curr = 1

count = 0
while count < 8:
    print(curr)
    prev, curr = curr, prev + curr
    count += 1
```

This is just visually easier to read, with clearer separation between variables.

In fact, there's a whole encyclopedia of python formatting conventions, called "PEP 8" (PEP means "Python Enhancement Proposal"), and different universities and companies each have their own modifications and additions to these. You don't necessarily need to be so stringent as to follow this strictly in your own code, but it can be good to know.

There are also tools that can automatically handle things like this kind of formatting for you. We'll hopefully talk about these more in another workshop, but I personally use the command-line tool `black` for python.

## Commenting

Comments make our code infinitely more readable by explaining in spoken language exactly what the code is doing.

```python
"""Compute the first 8 fibonacci numbers."""

# initial values at (0,1)
prev = 0
curr = 1

count = 0
while count < 8:  # repeat 8 times

    # output the next number
    print(curr)

    # update the numbers according to fibonacci rule: f(n) = f(n-1) + f(n-2)
    # using python's simultaneous assignment notation to allow this
    prev, curr = curr, prev + curr

    # increment the counter
    count += 1
```

A few things to note:

- On top is a _docstring_, or "documentation string". This is a special type of comment, written as a triple-quoted string, and placed at the start of a file, function, method, or class. Its purpose is to explain what the thing it documents does, without getting in to any of the details, so that anyone interested in using that object doesn't need to understand the implementation in order to understand how to use it. There are even tools that automatically collect all of your docstrings into a pretty set of HTML files, so you can browse the documentation without needing to look at the actual code.
- Comments can explain what the code does and/or how it does it, e.x. the comment which talks about simultaneous assignment.
- There is such a thing as overcommenting (to be honest, this example is probably overcommented), but it's way harder to overcomment than undercomment.

_Question: why might overcommenting sometimes be bad?_

## For Loop

To do the same thing some number of times, the convention is to use a `for` loop, instead of a `while` loop, like so:

```python
"""Compute the first 8 fibonacci numbers."""

# initial values at (0,1)
prev = 0
curr = 1

# repeat 8 times
for _ in range(8):

    # output the next number
    print(curr)

    # update the numbers according to fibonacci rule: f(n) = f(n-1) + f(n-2)
    # using python's simultaneous assignment notation to allow this
    prev, curr = curr, prev + curr
```

The main reason to do this is so we can't accidentally forget to increment our index.

Note the special variable `_`. This is a conventional variable name, sometimes called a "throwaway" or "black hole" variable, for when your variable isn't actually used. If we relied on the value of the counting variable to perform our computation, we could call it something like `count` or `index`.

This is probably where I'd stop if I was just writing a short script to compute Fibonacci numbers, but if you were writing in a professional or collaborative environment, where there was potential for the requirements to change later, there's a lot more that you could do.

## Function Abstraction

Right now, all our code is just sitting at the top level of our file. We should separate each piece of logic into its own function.

_Exercise: do this. Think about how small your functions can or should get._

Here's one example way to do this:

```python
"""Compute the first 8 fibonacci numbers."""


def fib_step(prev, curr):
    """Return the new previous and current numbers according to the fibonacci rule."""
    # return (f(n-1), f(n-1) + f(n-2))
    return curr, prev + curr


def print_first_n_fib(n):
    """Print the first n fibonacci numbers."""
    # initial values at (0,1)
    prev = 0
    curr = 1

    # repeat n times
    for _ in range(n):

        # output the next number
        print(curr)

        # update the numbers
        prev, curr = fib_step(prev, curr)


print_first_n_fib(8)
```

A few things to note:

- The functions and arguments should be named descriptively and according to convention, similarly to the variable names.
- There's a docstring explaining what each function does. I really think short docstrings are extremely helpful, even for short functions, and like comments, it's much easier to underuse than overuse them.
- You need to call the function at the bottom: `print_first_n_fib(8)`, so the script keeps its command-line behavior.

_Question: why are functions helpful here?_

- Abstraction: our `first_n_fib` function doesn't need to know the specific Fibonacci recurrence relation in order to drive the loop that implements the relation. This helps us find bugs faster.
- Code reuse: say we later have a project where we need to compute the first eight [Lucas numbers](https://en.wikipedia.org/wiki/Lucas_number). We could import `fib_step` into that project, since the step is the same.

## Single Responsibility

Right now, our `print_first_n_fib` function has two jobs: it's both responsible for _computing_ the first n Fibonacci numbers (using its helper function `fib_step`), and for _printing_ them to the terminal. Let's say that tomorrow, the powers that be decided that our code needs to compute the sum of the first 8 Fibonacci numbers, instead of just printing them out. Or, say we needed to write them to a file, instead of printing them. We would need to look through our code for actually computing the Fibonacci numbers (the process for which hasn't changed) in order to make either of these changes.

Instead, we can refactor our code like so:

```python
"""Compute the first 8 fibonacci numbers."""


def fib_step(prev, curr):
    """Return the new previous and current numbers according to the fibonacci rule."""
    # return (f(n-1), f(n-1) + f(n-2))
    return curr, prev + curr


def first_n_fib(n):
    """Return a list of the first n fibonacci numbers."""
    # initial values at (0,1)
    prev = 0
    curr = 1

    # stores the computed values for later return
    ret = []

    # repeat n times
    for _ in range(n):

        # store the next number
        ret.append(curr)

        # update the numbers
        prev, curr = fib_step(prev, curr)

    return ret


def print_list(to_print):
    """Print each value in to_print."""
    for val in to_print:
        print(val)


lst = first_n_fib(8)
print_list(lst)
```

Now each of our functions has a single responsibility: `first_n_fib` is responsible for _computing_ the Fibonacci numbers, and `print_list` prints each item in an _arbitrary_ list, which, in this case, is our list of Fibonacci numbers. If we need to print another list, we can reuse the code we wrote for `print_list`, and if we need to do some other computation on the Fibonacci numbers, we can reuse the code to compute the first `n` numbers.

This is an example of the "Single Responsibility Principle", or _SRP_. The SRP says that each function or class should be responsible for a single thing. What a "thing" means here is often left kind of vague and left to your best judgement. Another way to think of this principle is that each piece of code should have only a single reason to change: `first_n_fib` only changes if the definition of the Fibonacci numbers changes, `print_list` only changes if we decide there's a better way to print out lists (say, separated by commas, instead of newlines), and the code at the bottom changes in response to changes in the high-level requirements of our code; e.g., it could call a function `save_list_to_file` instead of `print_list`.

## Testing

A major, major advantage of the SRP is _automated testing_. Here, we're going to use a tool called `pytest`, a very standard tool for automatic testing of python code. You can probably install it with `pip3 install -U pytest`. We'll talk more about testing in a future workshop, but the basic idea is that `pytest` looks for functions whose names start with `test_`. We can use the special `assert` keyword inside these functions to cause a test to fail if any arbitrary condition is false. Note that we couldn't have written code like this before we did the SRP refactor: `print_first_n_fib` didn't return anything, and testing printed output is much, much harder than testing return values.

```python
"""Compute the first 8 fibonacci numbers."""


def fib_step(prev, curr):
    """Return the new previous and current numbers according to the fibonacci rule."""
    # return (f(n-1), f(n-1) + f(n-2))
    return curr, prev + curr


def first_n_fib(n):
    """Return a list of the first n fibonacci numbers."""
    # initial values at (0,1)
    prev = 0
    curr = 1

    # stores the computed values for later return
    ret = []

    # repeat n times
    for _ in range(n):

        # store the next number
        ret.append(curr)

        # update the numbers
        prev, curr = fib_step(prev, curr)

    return ret


def print_list(to_print):
    """Print each value in to_print."""
    for val in to_print:
        print(val)


lst = first_n_fib(8)
print_list(lst)


def test_first_n_fib_0():
    """Test that `first_n_fib` is correct for n=0."""
    assert first_n_fib(0) == []

def test_first_n_fib_2():
    """Test that `first_n_fib` is correct for n=2."""
    assert first_n_fib(2) == [1, 1]

def test_first_n_fib_10():
    """Test that `first_n_fib` is correct for n=10."""
    assert first_n_fib(10) == [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
```

Because our tests are in the same file as our code{{ footnote(content="In production code, you'd probably want a separate directory, `tests`, with a bunch of files with names like `test_fib.py`, each of which had these `test_`functions. Then `pytest` would automatically discover those tests without needing a command-line argument.") }}, we run pytest like `pytest fib.py`{{ footnote(content="Try it! Seriously, pytest is _awesome_. You're never going to test your code by hand ever again.") }} from the command line. You might rightly complain that we've duplicated code here (the tests are the same, except for the expected inputs and outputs): pytest has a feature which will let us fix this, but it's outside the scope of this workshop, unfortuantely. Again, we'll hopefully talk more about testing in another workshop, but it's super helpful for refactoring so we wanted to mention how it works: now we can run our tests after each refactor to make sure the refactor didn't break the part of our code that's tested.

## Addendum: Removing the List

By some measures, this code is actually worse than what we had originally, because it needs to allocate an entire list, whereas before we just needed `prev` and `curr`. As a result, it'll be slightly slower, and it requires (even asymptotically) more storage space on the disk than the previous version did. In the workshop, we left it there. I'm a big believer in writing readable, testable, maintainable code before you focus on optimization: well-written code is generally easier to confidently optimize, and often code you're writing isn't really performance-sensitive: maybe there's a much bigger performance bottleneck in your codebase, or maybe you're just writing a one-time script for something and it's ok if it takes a little bit of extra time.

That said, for the writeup, I wanted to give some suggestions about how to remove this extra list. The most idiomatic way to do this, in my opinion, is probably using a python feature called generators. This is outside the scope of 121, so I won't get into details here, but the idea is to "pause executing" the function at each fibonacci number, letting the caller do something with that number, and then only continuing when they ask for the next number. If you're interested, there are lots of resources online that can help you with this concept.
