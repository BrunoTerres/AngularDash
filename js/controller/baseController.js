angular.module('app').config(['growlProvider', function (growlProvider) {
  //Configuração do tempo que a mensagem ficará na tela
   growlProvider.globalTimeToLive({success: 5000, error:5000, warning:4000, info: 6000});
}]);

//========== CONTROLLER GERAL ==========// 
app.controller('baseController', function($scope,$timeout, cfpLoadingBar, $route, $routeParams, $location, $anchorScroll){
                
    //========== RECUPERAÇÃO SCOPE LOGIN / BASEAPI / PERMISSÕES  ==========//
    $scope.login = JSON.parse(window.sessionStorage.getItem('login'));  
    if($scope.login == null){
        window.location = "LOGIN/login.html";
    } else {
        if($scope.login.logado!=true){
            window.location = "LOGIN/login.html";
        }
    };   
      
    $scope.baseApi = window.sessionStorage.getItem('baseApi'); 
    $scope.permissoes = JSON.parse(window.sessionStorage.getItem('permissoes'));
     
    //========== CARREGAMENTO DE PAGINA - LOADING BAR ==========//    
    $scope.start = function() {
      cfpLoadingBar.start();
    };

    $scope.complete = function () {
      cfpLoadingBar.complete();
    }
       
    $scope.start();
    $scope.fakeIntro = true;
    $timeout(function() {
      $scope.complete();
      $scope.fakeIntro = false;
    }, 750);   
   
    //========== ROTAS ==========//  
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;     

    //========== RELOAD NA PAGINA HTML - URL ==========// 
    $scope.reloadPagina = function(){
        window.location.reload();         
    };
    
    //========== FUNÇÃO DATA PARA PAGINAS ==========//    
    var data = new Date();
    var primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1)
    var ultimoDia = new Date(data.getFullYear(), data.getMonth()+ 1, 0)
    if($scope.baseApi == 'http://127.0.0.1:7000/' || $scope.baseApi == 'http://192.168.0.143:7000/'){
        $scope.path = 1            
    }else{
        $scope.path = 2
    };

    $scope.filtro = {
        dataInicial: primeiroDia,
        dataFim: ultimoDia,
        codigoVendedor: $scope.login.codvendedor,
        superUsuario: $scope.login.superuser,
        lancamentoEmpresa: $scope.login.lancamento_empresa,
        idperfil: $scope.login.idperfil,
        local: $scope.path
    };     
    
    $scope.isValidDate = function(str) {
        return !!new Date(str).getTime();
    }   
    
    //========== IR PARA O TOP DA PAGINA  ==========//    
    $scope.gototop = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('top');

      // call $anchorScroll()
      $anchorScroll();
    };

    $scope.gototop(); 

    //==========  VERIFICAR SE ESTÁ EM IP INTERNO OU EXTERNO PARA GERAÇÃO DA PASTA ==========// 
   

    //========== FUNÇÃO PARA TRANSFORMAR DATA JAVASCRIPT ==========// 
    $scope.convertDateJavaScript = function(data,value){  
        var date = data.split('-');    
        if(value == 'I'){
            date = new Date(parseInt(date[2]), parseInt(date[1]-1), parseInt(date[0]));
        }else{
            date = new Date(parseInt(date[2]), parseInt(date[1]-1), parseInt(date[0])); 
        };        
        return date;       
    };

    //========== NOVA FUNÇÃO PARA TRANSFORMAR DATA JAVASCRIPT ==========// 
    $scope.convercaoDataParaJS = function(data){          
        var date = data.split('-');    
        date = new Date(parseInt(date[2]), parseInt(date[1]-1), parseInt(date[0]));
        return date
    };

    //==========  FUNÇÃO JAVA SCRIPT PARA CONTAR OS DIAS DO MÊS ==========//
    $scope.diasNoMes = function(mes,ano){
        var data = new Date(ano, mes, 0);
        return data.getDate();
    };    
    
});

//========== CONTROLLER DE OCIOSIDADE DO USUARIO ==========// 
app.controller('logoutBase', function($scope, $uibModal,Idle){

    $scope.start = function(value){
        if(value == true){
            closeModals();
            Idle.watch();
        }else{
            closeModals();
            Idle.unwatch();
        };       
    };

    $scope.start(true);
    
    //========== FUNÇÕES OCIOSIDADE DO CLIENTE ==========// 
    function closeModals(){
        if ($scope.warning){
            $scope.warning.close();
            $scope.warning = null;
        };

        if ($scope.timedout){
            $scope.timedout.close();
            $scope.timedout = null;
        };
    };

    $scope.$on('IdleStart', function(){
        closeModals();
        $scope.warning = $uibModal.open({
            templateUrl: 'warning-dialog.html',
            windowClass: 'modal-danger'
        });    
    });

    $scope.$on('IdleEnd', function(){
        closeModals();
    });

    $scope.$on('IdleTimeout', function(){
        closeModals();
        $scope.timedout = $uibModal.open({
            templateUrl: 'timedout-dialog.html',
            windowClass: 'modal-danger'
        });
        setTimeout(function(){  window.location = "LOGIN/login.html"; }, 2000);
    });
  
});

//========== CONFIGURAÇÃO DE ROTAS ==========// 
app.config(function($stateProvider){
    
    var base = {
        url: '/',
        name: 'base',
        templateUrl: 'base.html'
    }

    $stateProvider.state(base);

    //========== DIRETORIA  ==========//  
    var visaoGeralFat = {
        url: '/visaoGeralFat/',
        name: 'visaoGeralFat',
        templateUrl: 'DIRETORIA/visaoGeralFaturamento.html'
    }

    var vendasxestoqueAE = {
        url: '/vendasxestoqueAE/',
        name: 'vendasxestoqueAE',
        templateUrl: 'DIRETORIA/vendaxestoque.html'
    }

    var analiseLogisticoHavan = {
        url: '/analiseLogisticoHavan/',
        name: 'analiseLogisticoHavan',
        templateUrl: 'DIRETORIA/analiseLogisticoHavan.html'
    }

    var vendasEstoqueLoja = {
        url: '/vendasEstoqueLoja/',
        name: 'vendasEstoqueLoja',
        templateUrl: 'DIRETORIA/vendasxestoqueLoja.html'
    }


    $stateProvider.state(visaoGeralFat);
    $stateProvider.state(vendasxestoqueAE);
    $stateProvider.state(analiseLogisticoHavan);
    $stateProvider.state(vendasEstoqueLoja);
    //========== ATACADO  ==========//  
    var atacado = {
        url: '/atacado/',
        name: 'atacado',
        templateUrl: 'COMERCIAL/ATACADO/atacado.html'
    }
    
    var atacadoVendedor = {
        url:'/atacadoVendedor/',
        name: 'atacadoVendedor',
        templateUrl: 'COMERCIAL/ATACADO/vendedorAtacado.html'
    }
    
    var monitorTelevendas = {
        url: '/monitorTelevendas/',
        name: 'monitorTelevendas',
        templateUrl: 'COMERCIAL/ATACADO/monitorTelevendas.html'
    }
 
    var monitorAtacado = {
        url:'/monitorAtacado/',
        name: 'monitorAtacado',
        templateUrl: 'COMERCIAL/ATACADO/monitorAtacado.html'
    }
    
    var controleDeNovoCadastro = {
        url:'/controleDeNovoCadastro/',
        name: 'controleDeNovoCadastro',
        templateUrl: 'COMERCIAL/ATACADO/controledeNovoCadastroController.html'
    }
    
    var atacadoIndicador = {
        url:'/atacadoIndicador/',
        name: 'atacadoIndicador',
        templateUrl: 'COMERCIAL/ATACADO/atacadoIndicador.html'
    }
    
    var analiseLogistico = {
        url:'/analiseLogistico/',
        name: 'analiseLogistico',
        templateUrl: 'COMERCIAL/ATACADO/analiseLogistica.html'
    }

    var ordemDeCompra = {
        url:'/ordemDeCompra/',
        name: 'ordemDeCompra',
        templateUrl: 'COMERCIAL/ATACADO/ordemDeCompraCliente.html'
    }
    
    var ordemDeCompraBC = {
        url:'/ordemDeCompraBC/',
        name: 'ordemDeCompraBC',
        templateUrl: 'COMERCIAL/ATACADO/ocBacklogController.html'
    }

    $stateProvider.state(atacado);
    $stateProvider.state(atacadoVendedor);
    $stateProvider.state(monitorTelevendas);
    $stateProvider.state(monitorAtacado);
    $stateProvider.state(controleDeNovoCadastro);
    $stateProvider.state(atacadoIndicador);
    $stateProvider.state(analiseLogistico);
    $stateProvider.state(ordemDeCompra);
    $stateProvider.state(ordemDeCompraBC);

    //========== LOJAS  ==========//  
    var lojas = {
        url:'/lojas/',
        name: 'lojas',
        templateUrl: 'COMERCIAL/LOJAS/lojas.html'
    }
  
    var lojasGerentes = {
        url: '/lojasGerentes/',
        name: 'lojasGerentes',
        templateUrl: 'COMERCIAL/LOJAS/lojasGerentes.html'
    }
    
    var lojasAnaliseMovimento = {
        url: '/lojasAnaliseMovimento/',
        name: 'lojasAnaliseMovimento',
        templateUrl: 'COMERCIAL/LOJAS/lojasAnaliseMovimento.html'
    }

    var simulador = {
        url: '/simulador/',
        name: 'simulador',
        templateUrl: 'COMERCIAL/LOJAS/simulador.html'
    } 
    
    var analiseEstoqueFinanceiro = {
        url: '/analiseEstoqueFinanceiro/',
        name: 'analiseEstoqueFinanceiro',
        templateUrl: 'COMERCIAL/LOJAS/analiseEstoqueFinanceiro.html'
    } 

    var cadastroMeta = {
        url: '/cadastroMeta/',
        name: 'cadastroMeta',
        templateUrl: 'COMERCIAL/LOJAS/cadastroMeta.html'
    } 

    var dreLojas = {
        url: '/dreLojas/',
        name: 'dreLojas',
        templateUrl: 'COMERCIAL/LOJAS/dreLojas.html'
    } 

    var estoqueReserva = {
        url: '/estoqueReserva/',
        name: 'estoqueReserva',
        templateUrl: 'COMERCIAL/LOJAS/estoqueReserva.html'
    } 

    $stateProvider.state(lojas);    
    $stateProvider.state(lojasGerentes);  
    $stateProvider.state(lojasAnaliseMovimento);  
    $stateProvider.state(simulador);
    $stateProvider.state(analiseEstoqueFinanceiro);
    $stateProvider.state(cadastroMeta);
    $stateProvider.state(dreLojas);
    $stateProvider.state(estoqueReserva);

    //========== ECOMMERCE  ==========//
    var ecommerce = {
        url:'/ecommerce/',
        name: 'ecommerce',
        templateUrl: 'COMERCIAL/ECOMMERCE/ecommerce.html'
    }
    
    var analiseMovimento = {
        url: '/analiseMovimento/',
        name: 'analiseMovimento',     
        templateUrl: 'COMERCIAL/ECOMMERCE/analiseMovimento.html'
    }
    
    var evolucaoDiaria = {
        url: '/evolucaoDiaria/',
        name:'evolucaoDiaria',       
        cache: false,
        templateUrl:'COMERCIAL/ECOMMERCE/evolucaoDiaria.html'
    }
    
    var analiseProduto = {
        url: '/analiseProduto/',
        name:'analiseProduto',
        templateUrl:'COMERCIAL/ECOMMERCE/analiseProduto.html'
    }

    var campanha = {
        url: '/campanha/',
        name:'campanha',
        templateUrl:'COMERCIAL/ECOMMERCE/campanha.html'
    }

    var monitorEcommerce = {
        url: '/monitorEcommerce/',
        name:'monitorEcommerce',
        templateUrl:'COMERCIAL/ECOMMERCE/monitorEcommerce.html'
    }

    $stateProvider.state(ecommerce);
    $stateProvider.state(analiseMovimento);
    $stateProvider.state(evolucaoDiaria);
    $stateProvider.state(analiseProduto);
    $stateProvider.state(campanha);
    $stateProvider.state(monitorEcommerce);
    
    //========== COMPRAS ==========//
    var compras = {
        url:'/compras/',
        name: 'compras',
        templateUrl: 'COMPRAS/comprasGeral.html'
    }

    $stateProvider.state(compras);
    
    //========== LOGISTICA ==========//
    var estoque = {
        url:'/estoque/',
        name: 'estoque',
        templateUrl: 'LOGISTICA/estoque.html'
    }
    
    var agendamentoEntrega = {
        url:'/agendamentoEntrega/',
        name: 'agendamentoEntrega',
        templateUrl: 'LOGISTICA/angedamentoEntrega.html'
    }

    $stateProvider.state(estoque);
    $stateProvider.state(agendamentoEntrega);

    //========== FORNECEDORES ==========//
    var fornecedoresGeral = {
        url:'/fornecedoresGeral/',
        name: 'fornecedoresGeral',
        templateUrl: 'FORNECEDORES/fornecedoresGeral.html'
    }
    
    $stateProvider.state(fornecedoresGeral); 

    //========== PORTA HAVAN  ==========//  
    var cadastroProdutosHavan = {
        url: '/cadastroProdutosHavan/',
        name: 'cadastroProdutosHavan',
        templateUrl: 'PORTAL HAVAN/cadastroProdutos.html'
    }
    
    var usuariosHavan = {
        url:'/atacadusuariosHavanoVendedor/',
        name: 'usuariosHavan',
        templateUrl: 'PORTAL HAVAN/usuariosHavan.html'
    }

    var campanhaAtacado = {
        url:'/campanhaAtacado/',
        name: 'campanhaAtacado',
        templateUrl: 'PORTAL HAVAN/campanhas.html'
    }

    var devolucaoAvaria = {
        url:'/devolucaoAvaria/',
        name: 'devolucaoAvaria',
        templateUrl: 'PORTAL HAVAN/devolucaoAvaria.html'
    }

    var produtosLinhas = {
        url:'/produtosLinhas/',
        name: 'produtosLinhas',
        templateUrl: 'PORTAL HAVAN/produtosEmLinha.html'
    }

    $stateProvider.state(cadastroProdutosHavan);
    $stateProvider.state(usuariosHavan); 
    $stateProvider.state(campanhaAtacado); 
    $stateProvider.state(devolucaoAvaria); 
    $stateProvider.state(produtosLinhas); 
     
});

//========== CONFIG E RUN PARA OCIOSIDADE DO CLIENTE ==========// 
app.config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider){
    //1800
    IdleProvider.idle(3600);
    IdleProvider.timeout(5);
    KeepaliveProvider.interval(10);
}])/*
.run(['Idle', function(Idle){
    Idle.watch();
}]);*/

//========== DIRETIVA DE CRIAÇÃO DE PROGRESS BAR ==========// 
app.directive('progressBar', [function () {
    /* template: "<div ng-class='{\"btn-default\":true}'>Some</div>"*/
    return {
      restrict: 'E',
      scope: {
        curVal: '@',
        maxVal: '@'
      },
      template: "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-16 hidden-xs '>"+
                    "<div class='progress-bar'>"+
                    " <div ng-class='{\"progress-bar-bar\": curVal > 0 || curVal < 100, \"progress-bar-bar100\": curVal >= 100}'></div>" +
                    "</div>"+
                    "<div class='pull-left progress-bar-bar-Div-Button'><button type='button' class='btn progress-bar-bar-Button'>{{curVal}}% &nbsp</button></div> "+
                "</div>"
                ,    

      link: function ($scope, element, attrs) {
        
        function updateProgress() {
          var progress = 0;
          
          if ($scope.maxVal) {
            progress = Math.min($scope.curVal, $scope.maxVal) / $scope.maxVal * element.find('.progress-bar').width();
          }
          
          element.find('.progress-bar-bar').css('width', progress);          
        }
        
        $scope.$watch('curVal', updateProgress);
        $scope.$watch('maxVal', updateProgress);        
      }
    };  
 }]);


