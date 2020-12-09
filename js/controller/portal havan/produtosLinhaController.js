app.controller('produtosLinhaController', function($scope, $http,growl,Upload){

    if (!$scope.permissoes[43]){
        window.location = "LOGIN/login.html";
    };

    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };

    $scope.divVisualizar = false;
    $scope.divCadastroProduto = false;
    $scope.esconderBotao = false;

    $scope.produtoCadastro = {
        lancamento: 'N'
    };

    //========== GET PRODUTOS LINHA ==========//
    $scope.produtosLinhaGet = function(id,value){
        
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApi +'produtosLinhaGet/' + id,
                method: 'GET',              
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token  
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;                
                if(value == 'E'){

                    if (event.data.produtosEmLinhasGet.rows[0][7] == 'SIM'){
                        lancamento = 'S'
                    }else{
                        lancamento = 'N'
                    };
               
                    $scope.editarProdutosLinha = {
                        id: event.data.produtosEmLinhasGet.rows[0][0],
                        produto: event.data.produtosEmLinhasGet.rows[0][1],
                        fabricante: event.data.produtosEmLinhasGet.rows[0][2],
                        ean: event.data.produtosEmLinhasGet.rows[0][3],
                        precoPonta: event.data.produtosEmLinhasGet.rows[0][4],
                        custo: event.data.produtosEmLinhasGet.rows[0][5],
                        icms: event.data.produtosEmLinhasGet.rows[0][6],
                        lancamento: lancamento,
                        usuario: $scope.login.usuario                      
                    };
                    $('#modalEditarProdutosLinha').trigger('click');                      
                    console.log($scope.editarProdutosLinha)
                }              
                else{
                    $scope.getProdutosLinha = event.data.produtosEmLinhasGet;  
                    if($scope.getProdutosLinha. error){
                        growl.warning('<b>ATENÇÃO!</b><br> Não existe Linhas de Produto cadastrado');   
                        $scope.divCadastroProduto = true;
                    }else{
                        $scope.divVisualizar = true;                    
                        
                        var produtoLinha = $('#produtosLinha').DataTable({
                            "language": {
                                "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                            },   
                            "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                            "iDisplayLength": 10,            
                            "data": $scope.getProdutosLinha.rows,                                
                            "columns": $scope.getProdutosLinha.cols,             
                            "bDestroy": true,  
                            "order": [[3, "desc" ]], 
                            "columnDefs": [{
                                    "targets": [4,5,6], 
                                    "render": $.fn.dataTable.render.number( '.', ',', 2)
                                },
                                /*  
                                {
                                    "targets": [6], 
                                    "render": $.fn.dataTable.render.number( '.', ',', 2, '', ' %')
                                },  */                         
                                {
                                    "targets": 9,
                                    "width": "10%",   
                                    "className":"txtAlign",            
                                    "defaultContent": '<button  id=\"idProdutoLinhaEditar\" title="Editar" class="btn btn-round" type="button"><i style="font-size:10px" class="glyphicon glyphicon-edit" style="color:#2A3F54" aria-hidden="true"></i></button> <button  id=\"idProdutoLinhaInativar\" title="Editar" class="btn btn-round" type="button"><i style="font-size:10px" class="glyphicon glyphicon-remove" style="color:#2A3F54" aria-hidden="true"></i></button>'
                                }
                            ],                                                                       
                        });
    
                        $('#produtosLinha tbody').off().on( 'click','button', function () {
                            var action = this.id;
                            if(action == "idProdutoLinhaEditar"){
                                var tr=$(this).parents('tr');
                                if ($(tr).hasClass("child")){
                                var record = produtoLinha.row( $(this).parents('tr').prev('tr') ).data();
                                }else{
                                var record = produtoLinha.row( $(this).parents('tr') ).data();
                                }                            
                                $scope.produtosLinhaGet(record[0],'E');             
                            };
                            
                            if(action == "idProdutoLinhaInativar"){
                                var tr=$(this).parents('tr');
                                if ($(tr).hasClass("child")){
                                var record = produtoLinha.row( $(this).parents('tr').prev('tr') ).data();
                                }else{
                                var record = produtoLinha.row( $(this).parents('tr') ).data();
                                }
                                $scope.inativar = {
                                    usuario: $scope.login.usuario,
                                    produto: record[1],
                                    id: record[0],
                                    inativo: ''
                                    
                                };
                                if(record[8] == "SIM"){
                                    $scope.inativar.inativo = 'S';
                                }else{
                                    $scope.inativar.inativo = 'N';
                                }; 
                                $('#modalInativarProdutoLinha').trigger('click')
                                console.log($scope.inativar)
                            }; 
                        });  
                    };
                };            
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:104'); 
                };    
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };
    }; 

    //========== POST CADASTRAR PRODUTOS LINHAS   ==========//
    $scope.cadastroProdutosLinha = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.produtoCadastro.usuario = $scope.login.usuario;
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApi +'cadastroProdutosLinha/',
                method: 'POST',
                data: {'cadastroProdutosLinha': $scope.produtoCadastro},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;
                if(event.status == 200){
                    growl.success('<b>SUCESSO!</b><br>Produto cadastrado!');
                    $scope.produtosLinhaGet(0,'');   
                    $scope.divCadastroProduto = false;
                    $scope.divVisualizar = true;
                }else{
                    growl.warning('<b>SUCESSO!</b><br>Produto não cadastrado!');   
                };                        
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;                    
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:105');  
                };               
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };        
    };

    //========== POST EDITAR PRODUTOS LINHAS   ==========//
    $scope.editarProdutoLinha = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.produtoCadastro.usuario = $scope.login.usuario;
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApi +'editarProdutoLinha/',
                method: 'POST',
                data: {'editarProdutoLinha': $scope.editarProdutosLinha},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;
                if(event.status == 200){
                    growl.success('<b>SUCESSO!</b><br>Produto editado!');
                    $scope.produtosLinhaGet(0,'');   
                    $('#myModalEditarProdutosLinha').modal('hide');
                    $scope.divCadastroProduto = false;
                    $scope.divVisualizar = true;
                }else{
                    growl.warning('<b>SUCESSO!</b><br>Produto não editado!');   
                };                        
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;                    
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:106');  
                };               
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        }; 
    };
    
    $scope.inativarProdutoLinha = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.produtoCadastro.usuario = $scope.login.usuario;
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApi +'inativarProdutoLinha/',
                method: 'POST',
                data: {'inativarProdutoLinha': $scope.inativar},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;
                if(event.status == 200){
                    growl.success('<b>SUCESSO!</b><br>Produto inativado!');
                    $scope.produtosLinhaGet(0,'');   
                    $('#myModalInativarProdutoLinha').modal('hide');
                    $scope.divCadastroProduto = false;
                    $scope.divVisualizar = true;
                }else{
                    growl.warning('<b>SUCESSO!</b><br>Produto não inativado!');   
                };                        
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;                    
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:107');  
                };               
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        }; 
    }
    //========== CHAMADA DE FUNÇÃO GET PRODUTOS LINHAS ==========//
    $scope.produtosLinhaGet(0,'');

    //========== FUNÇÃO PARA HIDE E SHOW DE DIV ==========//
    $scope.menu = function(value){
        if( value == 1){
            $scope.divVisualizar = false;
            $scope.divCadastroProduto = true;
            $scope.esconderBotao = true;
        }else 
        if( value == 2){
            $scope.divVisualizar = true;
            $scope.divCadastroProduto = false;
            $scope.esconderBotao = false;
        }

    };
});