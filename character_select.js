<!-- character_select.html (drop-in ready) -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Aethergard — Choose Race</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    margin:0;
    background:#000;
    font-family: 'Courier New', monospace;
    color:#fff;
    overflow:hidden;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
  }
  .wrapper {
    text-align:center;
  }
  h1 {
    font-size:4vw;
    margin-bottom:20px;
    background:linear-gradient(#ff00ff,#00ffff);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    text-shadow:0 0 30px #ff00ff;
  }
  .race-grid {
    display:flex;
    gap:40px;
    justify-content:center;
  }
  .race {
    cursor:pointer;
    padding:20px;
    border:2px solid transparent;
    transition:0.25s;
    background:rgba(255,255,255,0.08);
    border-radius:10px;
  }
  .race:hover {
    transform:scale(1.12);
    border-color:#ff00ff;
  }
  .race img {
    width:140px;
    height:140px;
    image-rendering:pixelated;
  }
  .race-name {
    margin-top:10px;
    font-size:20px;
  }
  .key {
    opacity:0.6;
    margin-top:5px;
  }
</style>
</head>
<body>

<div class="wrapper">
  <h1>Choose Your Race</h1>
  <div class="race-grid">
    
    <div class="race" data-race="human">
      <img src="https://i.imgur.com/0ZxZ3bF.png">
      <div class="race-name">Human</div>
      <div class="key">Press 1</div>
    </div>

    <div class="race" data-race="elf">
      <img src="https://i.imgur.com/4jtG2fJ.png">
      <div class="race-name">Elf</div>
      <div class="key">Press 2</div>
    </div>

    <div class="race" data-race="dark_elf">
      <img src="https://i.imgur.com/DQ7p3Hr.png">
      <div class="race-name">Dark Elf</div>
      <div class="key">Press 3</div>
    </div>

  </div>
</div>

<script>
  function pickRace(r) {
    window.location.href = "index.html?race=" + r;
  }

  document.querySelectorAll('.race').forEach(r => {
    r.addEventListener('click', () => pickRace(r.dataset.race));
  });

  document.addEventListener('keydown', e => {
    if (e.key === "1") pickRace("human");
    if (e.key === "2") pickRace("elf");
    if (e.key === "3") pickRace("dark_elf");
  });
</script>

</body>
</html>
