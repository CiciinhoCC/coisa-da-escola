create table jogos (
	id int auto_increment primary key,
    nome varchar(255) not null,
    genero varchar(255),
    ano int,
    desenvolvedora varchar(255),
    descricao varchar(255),
    preco decimal(10,2)
);

insert into jogos (nome,genero,ano,desenvolvedora,descricao,preco) values
	("Mineirinho Ultra Adventures","Plataforma",2017,"Blender_Master","Pimentinha! Hamburgão! Pão com Linguiça!",4.97),
    ("Mineirinho Hoversurf in the Mess","Skate",2017,"Blender_Master","Uma obra de sátira política",4.97)